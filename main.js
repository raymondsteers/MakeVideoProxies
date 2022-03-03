// main.js THIS IS THE BACKEND PROCESS

// Modules to control application life and create native browser window
const { app, BrowserWindow, dialog, ipcMain, Menu, shell, powerSaveBlocker } = require('electron');
const path = require('path');
const os = require('os');
const spawn = require('cross-spawn');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const windowStateKeeper = require('electron-window-state');
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
//console.log(getLocalIp());

getFonts();

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

let mainWindow = null;
let devtools = false;
let proxy;
let ffmpegjobs = [];
let paused = false;
let powersaveid;

function createWindow () {

    let mainWindowState = windowStateKeeper({
        defaultWidth: 2000,
        defaultHeight: 2000
    });

    // Create the browser window.
    mainWindow = new BrowserWindow({
        show: false,
        webPreferences: {
          nodeIntegration: true,
          contextIsolation: false,
        },
        'x': mainWindowState.x,
        'y': mainWindowState.y,
        'width': mainWindowState.width,
        'height': mainWindowState.height
    });

    //mainWindow.maximize();
    mainWindow.show();

    // and load the index.html of the app.
    mainWindow.loadFile('index.html');

    // Open the DevTools.
    if(devtools){
        devtools = new BrowserWindow();
        mainWindow.webContents.setDevToolsWebContents(devtools.webContents);
        mainWindow.webContents.openDevTools();
    }

    mainWindowState.manage(mainWindow);
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

    //keep the system awake
    powersaveid = powerSaveBlocker.start('prevent-display-sleep');

    ffmpegjobs = JSON.parse(jobdetails);
    let gallery = JSON.parse(htmlgallery.split("\\").join("/"));
    //console.log(gallery);

    if(ffmpegjobs.length){
        let filetoproxy = ffmpegjobs.shift();
        ffproxy(filetoproxy);
    }

    function ffproxy(filetoproxy){
        //console.log("proxying file:"+filetoproxy.split('|'));

        let proxyerror = '';
        let filealreadyexists;
        let ffmpegparams = filetoproxy.split('|');
        let infile = ffmpegparams[ffmpegparams.indexOf('-i') + 1];
        let outfile = ffmpegparams[ffmpegparams.length - 1];

        proxy = spawn(ffmpegPath, ffmpegparams);

        mainWindow.send('proxyMakingJobStatus',`{"status":"started","job":"CONVERT ${infile} into ${outfile}"}`);


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
                    mainWindow.send('proxyMakingJobStatus',`{"status":"error","job":"COULD NOT CONVERT ${infile} into ${outfile}","error_stdout":"${proxyerror}"}`);
                }
            }
            if(ffmpegjobs.length){
                let filetoproxy = ffmpegjobs.shift();
                ffproxy(filetoproxy);
            }else{
                mainWindow.send('activity',['done making proxies of all input files']);

                if(gallery.create === true){
                    //console.log('making gallery at:"'+gallery.outputpath+'"');
                    fs.writeFile(gallery.outputpath,
                        htmlGalleryHeader() + htmlGalleryFiles(gallery.galleryfiles) + htmlGalleryFooter(),

                        err => {
                        if (err) {
                            console.error(err);
                            return;
                        }
                        //file written successfully
                        mainWindow.send('activity',[`HTML video gallery file created at|${gallery.outputpath}`]);

                        //let the system take back power save control
                        if(powersaveid){
                            powerSaveBlocker.stop(powersaveid);
                        }
                    });
                }

            }
        });
    }
}

function searchDirForVideoFilesRecursively(dirPath, depth, arrayOfFiles){// depth is really on or off. 0 or 1. 1 means go infinite deep
    let extlist = [".mp4", ".avi", ".m4v", ".mkv", ".mov",".webm",".ogv",".mjpeg",".3gp",".mpeg",".mpg",".r3d",".mxf",".MP4", ".AVI", ".M4V", ".MKV", ".MOV",".WEBM",".OGV",".MJPEG",".3GP",".MPEG",".MPG",".R3D",".MXF"];

    let files = fs.readdirSync(dirPath);

    arrayOfFiles = arrayOfFiles || [];

    files.forEach(function(file) {
        let filewithpath = path.join(dirPath, "/", file);

        try{// statsync will fail if the file is a broken symbolic link which happend on macos often due to stuff like... well life
            if (fs.statSync(filewithpath).isDirectory()) {
                if(depth > 0){
                    arrayOfFiles = searchDirForVideoFilesRecursively(filewithpath, depth, arrayOfFiles);
                }
            } else {

                // here we test each file to see if it ends with one of our extensions
                extlist.forEach(function(ext){
                    if(file.endsWith(ext)){
                        arrayOfFiles.push(filewithpath);
                    }
                });
            }
        }catch(e){}

    });

    return arrayOfFiles;
}

function probeInputFiles(inputDir,depthsetting){
    //console.log(`probeInputFiles: '${inputDir}' depthsetting: '${depthsetting}'`);
    mainWindow.send('activity',['probing input files using ffprobe:']);

    //console.log('type of fileslist:'+typeof inputDir);

    let maxdepth = 0;
    if(depthsetting === false){
        maxdepth = 1;
    }

    let fileslist;

    if(typeof inputDir === 'string'){
        //first get a list of all the files in that directory
        fileslist = searchDirForVideoFilesRecursively(inputDir, maxdepth);
    }
    if(typeof inputDir === 'object'){
        fileslist = inputDir;
    }

    console.log(fileslist);
    //console.log(fileslist.toString("utf8"));

    mainWindow.send('activity',['input files qty:'+fileslist.length]);

    if(fileslist.length){
        let filetoprobe = fileslist.pop();
        //console.log(filetoprobe);
        ffprobe(filetoprobe.replaceAll('\\','/'));
    }

    function ffprobe(filetoprobe){
        //console.log("probing file:"+filetoprobe);
        if(filetoprobe !== ''){

            let probedata = '';

            //let probe;
            //if (process.platform === 'darwin'){
                //probe = spawn(ffprobePath, ['-print_format', 'json', '-show_format', '-show_streams', '-show_frames', '-read_intervals', '%+#10', filetoprobe]);
            //}
            //if (process.platform === 'win32'){
                let probe = spawn(ffprobePath, ['-print_format', 'json', '-show_format', '-show_streams', '-show_frames', '-read_intervals', '%+#10', filetoprobe]);
            //}

            probe.stdout.on("data", data => {
                probedata = probedata + data;
                //console.log(`stdout: ${data}`);
            });

            probe.stdout.on("data", data => {
                //console.log(`stdout: ${data}`);
            });

            //probe.on('error', (error) => {
                //console.log(`error: ${error.message}`);
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
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
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
            margin: 4px;
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
            padding: 4px;
        }
        #head{
            top:0;
            width: 100%;
            position: fixed;
            height: 44px;
            left: 0;
            font-size: 1.2em;
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
        input,button{
            margin-left:1em;
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
        <button id="zoom" onclick="zoomAllVids()"/>zoom</button>
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
              <source src="${leafname}" type="video/mp4">

            </video>
            <div class="vidtitle">${leafname}</div>
        </div>
        `;
        vidid++;
    });//<source src="file://${videofile}" type="video/mp4">
    return html;
}

function htmlGalleryFooter(){
    let footer = `
</div>
<script>
let onsmallscreen;
let maxvidwidth;
if(window.innerWidth < 500){
    maxvidwidth = window.innerWidth - 16;
    document.documentElement.style.setProperty('--vid-width', maxvidwidth+'px');
    onsmallscreen = true;
}

function zoomAllVids(){
    if(onsmallscreen){
        if(getComputedStyle(document.documentElement).getPropertyValue('--vid-width') === maxvidwidth+'px'){
            document.documentElement.style.setProperty('--vid-width', ((maxvidwidth - 18) /2)+'px');
        }else{
            document.documentElement.style.setProperty('--vid-width', maxvidwidth+'px');
        }
    }else{
        if(getComputedStyle(document.documentElement).getPropertyValue('--vid-width') === '300px'){
            document.documentElement.style.setProperty('--vid-width', '600px');
        }else{
            document.documentElement.style.setProperty('--vid-width', '300px');
        }
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

function getFonts(){
    let fonts;
    let fontdata = '';
    if (process.platform === 'darwin'){
        fonts = spawn('bash', ['-c',"system_profiler SPFontsDataType|grep 'Location:'"]);

        fonts.stdout.on("data", data => {
            fontdata = fontdata + data;
        });

        fonts.stdout.on("data", data => {
            //console.log(`stdout: ${data}`);
        });

        fonts.on('error', (error) => {
            //console.log(`error: ${error.message}`);
        });

        fonts.on("close", code => {
            //console.log(`fonts child process exited with code ${code}`);
            if(code === 0){
                mainWindow.send('fontslistmac',fontdata);
            }else{
                //mainWindow.send('inputfilesprobe',`{"format":{"filename":"${filetoprobe}","format_long_name":"BAD MEDIA FILE"}}`);
            }
        });
    }
    if (process.platform === 'win32'){
        fonts = spawn('reg', [ 'query', "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Fonts", "/s"]);

        fonts.stdout.on("data", data => {
            fontdata = fontdata + data;
            //console.log(`stdout: ${data}`);
        });

        fonts.stdout.on("data", data => {
            //console.log(`stdout: ${data}`);
        });

        fonts.on('error', (error) => {
            //console.log(`error: ${error.message}`);
        });

        fonts.on("close", code => {
            //console.log(`fonts child process exited with code ${code}`);
            if(code === 0){
                setTimeout(function(){
                    mainWindow.send('fontslistwin',fontdata);
                },2000);
            }else{
                //mainWindow.send('inputfilesprobe',`{"format":{"filename":"${filetoprobe}","format_long_name":"BAD MEDIA FILE"}}`);
            }
        });
    }
}

function getLocalIp(){
    let clientIp = Object.values(os.networkInterfaces())
        .flat()
        .filter((item) => !item.internal && item.family === "IPv4")
        .find(Boolean).address;

    return clientIp;
}