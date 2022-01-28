// main.js THIS IS THE BACKEND PROCESS

// Modules to control application life and create native browser window
const { app, BrowserWindow, dialog, ipcMain, Menu, shell } = require('electron');
const path = require('path');
const os = require('os');
const spawn = require('cross-spawn');
const fs = require('fs')
const ffmpegPath = require('ffmpeg-static').replace(
    'app.asar',
    'app.asar.unpacked'
);
const ffprobePath = require('ffprobe-static').path.replace(
    'app.asar',
    'app.asar.unpacked'
);
//console.log(ffmpegPath);
//console.log(ffprobePath);
//console.log(process.platform);// windows will always be "win32" mac will always be "darwin"

const FileHound = require('filehound');

let ntsuspend;
if (process.platform === 'win32') {
    ntsuspend = require('ntsuspend');
}

const template = [{
    label: "Application",
    submenu: [
        { label: "About Application", selector: "orderFrontStandardAboutPanel:" },
        { type: "separator" },
        { label: "Quit", accelerator: "Command+Q", click: function() { app.quit(); }}
    ]}, {
    label: "Edit",
    submenu: [
        { label: "Undo", accelerator: "CmdOrCtrl+Z", selector: "undo:" },
        { label: "Redo", accelerator: "Shift+CmdOrCtrl+Z", selector: "redo:" },
        { type: "separator" },
        { label: "Cut", accelerator: "CmdOrCtrl+X", selector: "cut:" },
        { label: "Copy", accelerator: "CmdOrCtrl+C", selector: "copy:" },
        { label: "Paste", accelerator: "CmdOrCtrl+V", selector: "paste:" },
        { label: "Select All", accelerator: "CmdOrCtrl+A", selector: "selectAll:" }
    ]}
];

Menu.setApplicationMenu(Menu.buildFromTemplate(template));
//Menu.setApplicationMenu(null);

//dialog.showErrorBox = function(title, content) {
    //console.log(`${title}\n${content}`);
//};

let mainWindow = null;
//let devtools = null;
let proxy;
let ffmpegjobs = [];
let paused = false;

function createWindow () {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        show: false,
        webPreferences: {
          nodeIntegration: true,
          contextIsolation: false,
        }
    });
    //devtools = new BrowserWindow();

    mainWindow.maximize();
    mainWindow.show();

    // and load the index.html of the app.
    mainWindow.loadFile('index.html');

    // Open the DevTools.
    //mainWindow.webContents.setDevToolsWebContents(devtools.webContents);
    //mainWindow.webContents.openDevTools();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
    createWindow();

    app.on('activate', function () {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
})

// ---------------------------------------------------------------------

ipcMain.on('runbackendcommand', (event, arg) => {
    //console.log('asynch message from frontend:');
    //console.log(arg.command);
    if(arg.command === 'chooseInputDir'){
        chooseInputDir(event,arg.setting);
    }
    if(arg.command === 'chooseInputFiles'){
        chooseInputFiles(event,arg.setting);
    }
    if(arg.command === 'scanInputDir'){
        scanInputDir(event,arg.setting,arg.depthsetting);
    }
    if(arg.command === 'chooseOutputDir'){
        chooseOutputDir(event,arg.setting);
    }
    if(arg.command === 'startMakingProxies'){
        startMakingProxies(event,arg.jobdetails,arg.htmlgallery);
    }
    if(arg.command === 'openGalleryFile'){
        openGalleryFile(arg.htmlgallery);
    }
    if(arg.command === 'killProxyJob'){
        killProxyJob(event);
    }
    if(arg.command === 'pauseOrResumeProxyJob'){
        pauseOrResumeProxyJob(event);
    }
})

// ---------------- FUNCTIONS -----------------------------------
function openGalleryFile(galleryfilewithpath){
    //console.log('file:///'+decodeURIComponent(galleryfilewithpath));
    //console.log('file:///'+galleryfilewithpath);
    //shell.openPath('file:///'+decodeURIComponent(galleryfilewithpath));
    shell.openExternal('file:///'+decodeURIComponent(galleryfilewithpath));
}

function chooseInputDir(event,lastsetting){
    let inputDir = dialog.showOpenDialogSync({
        properties: ['openDirectory'],
        title: "Choose Input Directory for Video source Files",
        message: "Choose Input Directory for Video source Files",
        buttonLabel: 'Choose Dir',
        defaultPath: lastsetting
    });
    if(inputDir === undefined){
        return;
    }
    event.reply('choosenInputDir', inputDir);
}

function chooseInputFiles(event,lastsetting){
    let inputFiles = dialog.showOpenDialogSync({
        properties: ['openFile','multiSelections'],
        title: "Choose Input Files as Video source Files",
        message: "Choose Input Files as Video source Files",
        buttonLabel: 'Choose Files',
        defaultPath: lastsetting,
        filters: [{name: 'Videos', extensions: ["mp4", "avi", "m4v", "mkv", "mov","webm","ogv","mjpeg","3gp","mpg","mpeg","r3d","mxf"]},{ name: 'All Files', extensions: ['*'] }]
    });
    if(inputFiles === undefined){
        return;
    }
    event.reply('choosenInputFiles', inputFiles);
    //console.log(inputFiles);
}

function scanInputDir(event,lastsetting,depthsetting){
    event.reply('scanInputDir', lastsetting);
    probeInputFiles(lastsetting,depthsetting);
}

function chooseOutputDir(event,lastsetting){
    let outputDir = dialog.showOpenDialogSync({
        properties: ['openDirectory', 'createDirectory'],
        title: "Choose Output Directory for Video proxy Files",
        message: "Choose Output Directory for Video proxy Files",
        defaultPath: lastsetting
    });
    if(outputDir === undefined){
        return;
    }
    event.reply('choosenOutputDir', outputDir[0].replaceAll('\\','/'));
}

function killProxyJob(event){
    ffmpegjobs = [];
    let waskilled = proxy.kill();
    event.reply('killedProxyJob', waskilled);
}

function pauseOrResumeProxyJob(event){
    if(paused){
        //then resume
        let wasresumed;
        if (process.platform === 'win32') {
            wasresumed = ntsuspend.resume(proxy.pid);
        }else{
            wasresumed = proxy.kill('SIGCONT');
        }

        //console.log(wasresumed);
        paused = false;
        event.reply('resumedProxyJob', wasresumed);
    }else{
        //then pause
        let waspaused;
        if (process.platform === 'win32') {
            waspaused = ntsuspend.suspend(proxy.pid);
        }else{
            waspaused = proxy.kill('SIGSTOP');
        }

        //console.log(waspaused);
        paused = true;
        event.reply('pausedProxyJob', waspaused);
    }

}

function startMakingProxies(event,jobdetails,htmlgallery){
    //console.log(htmlgallery);
    mainWindow.send('activity',['started making proxies of all input files']);
    //console.log('startMakingProxies');
    //console.log(jobdetails);

    ffmpegjobs = JSON.parse(jobdetails);
    let gallery = JSON.parse(htmlgallery.split("\\").join("/"));
    //console.log(gallery);

    if(ffmpegjobs.length){
        let filetoproxy = ffmpegjobs.pop();
        ffproxy(filetoproxy);
    }

    function ffproxy(filetoproxy){
        //console.log("proxying file:"+filetoproxy.split('|'));

        let proxydata = '';
        let proxyerror = '';
        let filealreadyexists;
        let ffmpegparams = filetoproxy.split('|');
        let infile = ffmpegparams[ffmpegparams.indexOf('-i') + 1];
        let outfile = ffmpegparams[ffmpegparams.length - 1];

        proxy = spawn(ffmpegPath, ffmpegparams);

        mainWindow.send('proxyMakingJobStatus',`{"status":"started","job":"CONVERT ${infile} into ${outfile}"}`);

        proxy.stdout.on("data", data => {
            proxydata = proxydata + data;
            //console.log(`stdout: ${data}`);
        });

        proxy.stderr.on("data", data => {
            //console.log(`stderr: ${data}`);
            if(data.indexOf('frame=') === 0){// this is progress
                mainWindow.send('proxyMakingJobStatus',`{"status":"working","fps":"${data}"}`);
            }
            if(data.indexOf('already exists. Exiting.') > -1){
                filealreadyexists = true;
                mainWindow.send('proxyMakingJobStatus',`{"status":"alreadyexists","alreadyexists":"${data}"}`);
            }
        });

        proxy.on('error', (error) => {
            //console.log(`error: ${error.message}`);
            proxyerror = error.message;
        });

        proxy.on("close", code => {
            //console.log(`ffproxy for '${filetoproxy}' child process exited with code ${code}`);
            if(code === 0){
                mainWindow.send('proxyMakingJobStatus',`{"status":"complete","job":"CONVERTED ${infile} into ${outfile}"}`);
            }else{
                if(!filealreadyexists){
                    mainWindow.send('proxyMakingJobStatus',`{"status":"error","job":"COULD NOT CONVERT ${infile} into ${outfile}","error_stderr":"${proxyerror}"}`);
                }
            }
            if(ffmpegjobs.length){
                let filetoproxy = ffmpegjobs.pop();
                ffproxy(filetoproxy);
            }else{
                mainWindow.send('activity',['done making proxies of all input files']);

                if(gallery.create === true){
                    //console.log('making gallery at:"'+gallery.outputpath+'"');
                    fs.writeFile(gallery.outputpath+'/gallery.html',
                        htmlGalleryHeader() + htmlGalleryFiles(gallery.galleryfiles) + htmlGalleryFooter(),

                        err => {
                      if (err) {
                        console.error(err)
                        return
                      }
                      //file written successfully
                      mainWindow.send('activity',[`HTML video gallery file created at|${gallery.outputpath}/gallery.html`]);
                    });
                }

            }
        });
    }
}

function probeInputFiles(inputDir,depthsetting){
    //console.log(`probeInputFiles: '${inputDir}' depthsetting: '${depthsetting}'`);
    mainWindow.send('activity',['probing input files using ffprobe:']);

    //console.log('type of fileslist:'+typeof inputDir);

    let maxdepth = 0;
    if(depthsetting === false){
        maxdepth = 100;
    }

    let fileslist;

    if(typeof inputDir === 'string'){
        //first get a list of all the files in that directory
        const filehound = FileHound.create();
        fileslist = filehound.path(inputDir)
                                .depth(maxdepth)
                                .ignoreHiddenDirectories()
                                .ext(".mp4", ".avi", ".m4v", ".mkv", ".mov",".webm",".ogv",".mjpeg",".3gp",".mpeg",".mpg",".r3d",".mxf",".MP4", ".AVI", ".M4V", ".MKV", ".MOV",".WEBM",".OGV",".MJPEG",".3GP",".MPEG",".MPG",".R3D",".MXF")
                                .findSync();
    }
    if(typeof inputDir === 'object'){
        fileslist = inputDir;
    }

    //console.log(fileslist);
    //console.log(fileslist.toString("utf8"));

    mainWindow.send('activity',['input files qty:'+fileslist.length]);

    if(fileslist.length){
        let filetoprobe = fileslist.pop();
        //console.log(filetoprobe);
        //ffprobe(filetoprobe.split(path.sep).join(path.posix.sep));
        //ffprobe(filetoprobe.replaceAll('\\','\\\\'));
        ffprobe(filetoprobe.replaceAll('\\','/'));
    }

    function ffprobe(filetoprobe){
        //console.log("probing file:"+filetoprobe);
        if(filetoprobe !== ''){

            let probedata = '';

            let probe;
            if (process.platform === 'darwin'){
                probe = spawn(ffprobePath, ['-print_format', 'json', '-show_format', '-show_streams', filetoprobe]);
            }
            if (process.platform === 'win32'){
                probe = spawn(ffprobePath, ['-print_format', 'json', '-show_format', '-show_streams', filetoprobe]);
            }

            probe.stdout.on("data", data => {
                probedata = probedata + data;
                //console.log(`stdout: ${data}`);
            });

            probe.stderr.on("data", data => {
                //console.log(`stderr: ${data}`);
            });

            //probe.on('error', (error) => {
                ////console.log(`error: ${error.message}`);
            //});

            probe.on("close", code => {
                //console.log(`ffprobe for '${filetoprobe}' child process exited with code ${code}`);
                if(code === 0){
                    mainWindow.send('inputfilesprobe',probedata.toString("utf8"));
                }else{
                    mainWindow.send('inputfilesprobe',`{"format":{"filename":"${filetoprobe}","format_long_name":"BAD MEDIA FILE"}}`);
                }
                if(fileslist.length){
                    let filetoprobe = fileslist.pop();
                    //ffprobe(filetoprobe);
                    ffprobe(filetoprobe.replaceAll('\\','/'));
                }else{
                    mainWindow.send('activity',['done probing input files']);
                }
            });
        }else{
            let filetoprobe = fileslist.pop();
            ffprobe(filetoprobe); // without this, if there is an entry that is an empty string we will get hung
            // find seems to produce output with the last entry as an empty string (likely line return)
        }
    }
}

function htmlGalleryHeader(){
    let datetime = new Date().toString().substring(0,33);
    let header = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>VideoProxy Maker Gallery</title>
    <style>
        :root {
            --vid-width: 300px;
        }
        body{
            background-color:black;
            color:white;
            font-family:arial;
            padding: 0;
            margin: 0;
            box-sizing: border-box;
        }
        .vids{
            position: relative;
            display:inline-block;
            border: 1px solid grey;
            margin: 1rem;
            padding-top: 20px;
            background-color: #2f2f2f;
        }
        .videoz{
            position:relative;
            width: var(--vid-width);
            background-color: black;
        }
        .vert{
            position:absolute;
            -webkit-appearance: slider-vertical;
            width: 3px;
            left: 6px;
            top: 18px;
            height: 170px;
        }
        .vscroller{
            position:absolute;
            width: 300px;
            height: 3px;
            left: 17px;
            bottom: 6px;
        }
        .vidtitle{
            position:absolute;
            top: 2px;
            width: 267px;
            overflow-x: clip;
            font-size: 80%;
            left: 3px;
        }
        .vinfo{
            position:absolute;
            top: -1px;
            width: 14px;
            font-size: 80%;
            right: 44px;
            text-align: center;
            cursor:pointer;
        }
        .stime{
            position:absolute;
            top: 173px;
            color: #dedbdb;
            text-shadow: 0px 0px 3px rgba(0,0,0,0.9);
        }
        .ctime{
            position:absolute;
            top: 173px;
            left: 128px;
            text-shadow: 0px 0px 3px rgba(0,0,0,0.9);
        }
        .etime{
            position:absolute;
            top: 173px;
            left: 248px;
            color: #dedbdb;
            text-shadow: 0px 0px 3px rgba(0,0,0,0.9);
        }
        video{
            box-sizing: border-box;
        }
        #vidgroup{
            height: calc(100% - 70px);
            top:70px;
            width: 100%;
            position: fixed;
            left: 0;
            overflow-y: scroll;
        }
        #head{
            top:0;
            width: 100%;
            position: fixed;
            height: 44px;
            left: 0;
            font-size: 35px;
            text-align:center;
        }
        #settings{
            top:45px;
            width: 100%;
            position: fixed;
            height: 44px;
            left: 0;
            font-size: 16px;
            text-align:center;
            }
        input{
            margin-left:40px;
        }
    </style>
</head>
<body>
<div id="head">
    ${datetime}
</div>
<div id="settings">
    <span>
        <input id="pauseothers" type="checkbox"/>pause others
    </span>
    <span>
        <input id="muteothers" type="checkbox"/>mute others
    </span>
    <span>
        <input id="zoom" type="checkbox" onclick="zoomAllVids()"/>zoom
    </span>
</div>
<div id="vidgroup">
    `;

    return header;
}

function htmlGalleryFiles(galleryfiles){
    let html = '';
    var vidid = 0;
    galleryfiles.forEach((videofile) => {
        let leafname= videofile.split('\\').pop().split('/').pop();
        html = html + `
        <div class="vids">
            <video id="vid${vidid}" class="videoz" onplay="muteOthers('vid${vidid}')" controls>
              <source src="file://${videofile}" type="video/mp4">
            </video>
            <div class="vidtitle">${leafname}</div>
        </div>
        `;
        vidid++;
    });
    return html;
}

function htmlGalleryFooter(){
    let footer = `
</div>
<script>
function zoomAllVids(){
    if(getComputedStyle(document.documentElement).getPropertyValue('--vid-width') === '300px'){
        document.documentElement.style.setProperty('--vid-width', '600px');
    }else{
        document.documentElement.style.setProperty('--vid-width', '300px');
    }
}
function muteOthers(notmyid){
    const allvids = document.querySelectorAll('video');
    for (const vid of allvids) {
        if(vid.id !== notmyid){
            if(document.getElementById("muteothers").checked){
                vid.muted = true;
            }
            if(document.getElementById("pauseothers").checked){
                vid.pause();
            }
        }else{
            vid.muted = false;
        }
    }
}
</script>
</body>
</html>
    `;
    return footer;
}
