// THIS IS THE FRONT END
// ----------------- cool global vars :) -------------------------------
let inputfileslist = [];
let inputvideoque = [];
let inputvideoquetotallength = 0;
let inputvideoquejobcounter = 1;
let videoprobingunderway = false;
let videoproxingunderway = false;

jscolor.presets.default = {
    previewSize:20
};

// ----------------- load last saved settings -------------------------------

if (localStorage.proxy_input_last_dir){
    document.getElementById("inputdir").placeholder = localStorage.proxy_input_last_dir;
}

if (localStorage.proxy_input_dir_history){
    loadInputDirHistory();
}

if (localStorage.proxy_output_last_dir){
    document.getElementById("outputdir").value = localStorage.proxy_output_last_dir;
}

if (localStorage.proxy_output_dir_history){
    loadOutputDirHistory();
}

if (localStorage.customffmpegoptions){
    document.getElementById("customffmpegoptions").value = localStorage.customffmpegoptions;
}

// the following items have defaults which we set the first time the program is run
// considering that it's likely the best options for proxy vids will be mp4 files with h264 and aac audio with ultrafast crf 20
// these will run really fast and will be loadable in a web browser (actually there is a problem with FF and AAC sometimes and we might switch to MP3)

if (localStorage.proxy_output_last_width){
    document.getElementById("outputwidth").value = localStorage.proxy_output_last_width;
}else{
    localStorage.setItem("proxy_output_last_width","640");
    document.getElementById("outputwidth").value = localStorage.proxy_output_last_width;
}

if (localStorage.proxy_output_last_height){
    document.getElementById("outputheight").value = localStorage.proxy_output_last_height;
}else{
    localStorage.setItem("proxy_output_last_height","360");
    document.getElementById("outputheight").value = localStorage.proxy_output_last_height;
}

if (localStorage.proxy_output_last_fps){
    document.getElementById("outputfps").value = localStorage.proxy_output_last_fps;
}else{
    localStorage.setItem("proxy_output_last_fps","");
    document.getElementById("outputfps").value = localStorage.proxy_output_last_fps;
}

if (localStorage.proxy_last_append_to_queue){
    document.getElementById("appendtoqueue").checked = JSON.parse(localStorage.proxy_last_append_to_queue);
}else{
    localStorage.setItem("proxy_last_append_to_queue","false");
    document.getElementById("appendtoqueue").checked = JSON.parse(localStorage.proxy_last_append_to_queue);
}

if (localStorage.proxy_last_only_make_new){
    document.getElementById("onlymakenew").checked = JSON.parse(localStorage.proxy_last_only_make_new);
}else{
    localStorage.setItem("proxy_last_only_make_new","true");
    document.getElementById("onlymakenew").checked = JSON.parse(localStorage.proxy_last_only_make_new);
}

if (localStorage.proxy_last_auto_crop){
    document.getElementById("autocrop").checked = JSON.parse(localStorage.proxy_last_auto_crop);
}else{
    localStorage.setItem("proxy_last_auto_crop","true");
    document.getElementById("autocrop").checked = JSON.parse(localStorage.proxy_last_auto_crop);
}

if (localStorage.htmlgallery){
    document.getElementById("htmlgallery").checked = JSON.parse(localStorage.htmlgallery);
}else{
    localStorage.setItem("htmlgallery","true");
    document.getElementById("htmlgallery").checked = JSON.parse(localStorage.htmlgallery);
}

if (localStorage.outputvideocontainer){
    document.getElementById("outputvideocontainer").value = localStorage.outputvideocontainer;
}else{
    localStorage.setItem("outputvideocontainer","mp4");
    document.getElementById("outputvideocontainer").value = localStorage.outputvideocontainer;
}

if (localStorage.outputvideocodec){
    document.getElementById("outputvideocodec").value = localStorage.outputvideocodec;
}else{
    localStorage.setItem("outputvideocodec","libx264");
    document.getElementById("outputvideocodec").value = localStorage.outputvideocodec;
}

if (localStorage.outputvideocrf){
    document.getElementById("outputvideocrf").value = localStorage.outputvideocrf;
}else{
    localStorage.setItem("outputvideocrf","20");
    document.getElementById("outputvideocrf").value = localStorage.outputvideocrf;
}

if (localStorage.outputaudiocodec){
    document.getElementById("outputaudiocodec").value = localStorage.outputaudiocodec;
}else{
    localStorage.setItem("outputaudiocodec","aac");
    document.getElementById("outputaudiocodec").value = localStorage.outputaudiocodec;
}

if (localStorage.outputvideopreset){
    document.getElementById("outputvideopreset").value = localStorage.outputvideopreset;
}else{
    localStorage.setItem("outputvideopreset","ultrafast");
    document.getElementById("outputvideopreset").value = localStorage.outputvideopreset;
}

if (localStorage.outputvideotune){
    document.getElementById("outputvideotune").value = localStorage.outputvideotune;
}else{
    localStorage.setItem("outputvideotune","none");
    document.getElementById("outputvideotune").value = localStorage.outputvideotune;
}

if (localStorage.outputvideopxlfmt){
    document.getElementById("outputvideopxlfmt").value = localStorage.outputvideopxlfmt;
}else{
    localStorage.setItem("outputvideopxlfmt","yuv420p");
    document.getElementById("outputvideopxlfmt").value = localStorage.outputvideopxlfmt;
}

if (localStorage.outputvideoproresqscale){
    document.getElementById("outputvideoproresqscale").value = localStorage.outputvideoproresqscale;
}else{
    localStorage.setItem("outputvideoproresqscale","11");
    document.getElementById("outputvideoproresqscale").value = localStorage.outputvideoproresqscale;
}

if (localStorage.outputvideoproresprofile){
    document.getElementById("outputvideoproresprofile").value = localStorage.outputvideoproresprofile;
}else{
    localStorage.setItem("outputvideoproresprofile","auto");
    document.getElementById("outputvideoproresprofile").value = localStorage.outputvideoproresprofile;
}

if (localStorage.hardwareacceleration){
    document.getElementById("hardwareacceleration").checked = JSON.parse(localStorage.hardwareacceleration);
}else{
    localStorage.setItem("hardwareacceleration","true");
    document.getElementById("hardwareacceleration").checked = JSON.parse(localStorage.hardwareacceleration);
}

if (localStorage.faststartforwebvideo){
    document.getElementById("faststartforwebvideo").checked = JSON.parse(localStorage.faststartforwebvideo);
}else{
    localStorage.setItem("faststartforwebvideo","true");
    document.getElementById("faststartforwebvideo").checked = JSON.parse(localStorage.faststartforwebvideo);
}

if (localStorage.burnintext){
    document.getElementById("burnintext").value = localStorage.burnintext;
}else{
    localStorage.setItem("burnintext","");
    document.getElementById("burnintext").value = localStorage.burnintext;
}

if (localStorage.burnintextlocation){
    document.getElementById("burnintextlocation").value = localStorage.burnintextlocation;
}else{
    localStorage.setItem("burnintextlocation","DC");
    document.getElementById("burnintextlocation").value = localStorage.burnintextlocation;
}

if (localStorage.burnintextsize){
    document.getElementById("burnintextsize").value = localStorage.burnintextsize;
}else{
    localStorage.setItem("burnintextsize","30");
    document.getElementById("burnintextsize").value = localStorage.burnintextsize;
}

if (localStorage.burnintextcolor){
    document.getElementById("burnintextcolor").value = localStorage.burnintextcolor;
}else{
    localStorage.setItem("burnintextcolor","#00BC1CFF");
    document.getElementById("burnintextcolor").value = localStorage.burnintextcolor;
}

if (localStorage.burnintextbordercolor){
    document.getElementById("burnintextbordercolor").value = localStorage.burnintextbordercolor;
}else{
    localStorage.setItem("burnintextbordercolor","#DBDBDBFF");
    document.getElementById("burnintextbordercolor").value = localStorage.burnintextbordercolor;
}

if (localStorage.burnintextborder){
    document.getElementById("burnintextborder").value = localStorage.burnintextborder;
}else{
    localStorage.setItem("burnintextborder","0");
    document.getElementById("burnintextborder").value = localStorage.burnintextborder;
}

if (localStorage.burnintimecode){
    document.getElementById("burnintimecode").checked = JSON.parse(localStorage.burnintimecode);
}else{
    localStorage.setItem("burnintimecode","false");
    document.getElementById("burnintimecode").checked = JSON.parse(localStorage.burnintimecode);
}

if (localStorage.burnintimecodelocation){
    document.getElementById("burnintimecodelocation").value = localStorage.burnintimecodelocation;
}else{
    localStorage.setItem("burnintimecodelocation","LR");
    document.getElementById("burnintimecodelocation").value = localStorage.burnintimecodelocation;
}

if (localStorage.burnintimecodesize){
    document.getElementById("burnintimecodesize").value = localStorage.burnintimecodesize;
}else{
    localStorage.setItem("burnintimecodesize","30");
    document.getElementById("burnintimecodesize").value = localStorage.burnintimecodesize;
}

if (localStorage.burnintimecodecolor){
    document.getElementById("burnintimecodecolor").value = localStorage.burnintimecodecolor;
}else{
    localStorage.setItem("burnintimecodecolor","#FFAC05FF");
    document.getElementById("burnintimecodecolor").value = localStorage.burnintimecodecolor;
}

if (localStorage.burnintimecodeborder){
    document.getElementById("burnintimecodeborder").value = localStorage.burnintimecodeborder;
}else{
    localStorage.setItem("burnintimecodeborder","0");
    document.getElementById("burnintimecodeborder").value = localStorage.burnintimecodeborder;
}

if (localStorage.burnintimecodebordercolor){
    document.getElementById("burnintimecodebordercolor").value = localStorage.burnintimecodebordercolor;
}else{
    localStorage.setItem("burnintimecodebordercolor","#DBDBDBFF");
    document.getElementById("burnintimecodebordercolor").value = localStorage.burnintimecodebordercolor;
}

// ----------------- set log window to right height ------------------------------
window.addEventListener('load', function () {
    document.getElementById("activitylog").style.height = (window.innerHeight - document.getElementById("activitylog").getBoundingClientRect().top -45) + 'px';
});

// ----------------- handle incoming messages from back end ----------------------
const { ipcRenderer } = require('electron');

ipcRenderer.on('choosenInputDir', (event, arg) => {
    console.log(arg);
    if(arg){
        if(arg[0]){
            document.getElementById("inputdir").value = arg[0];
            document.getElementById("scaninputdir").innerHTML = 'Scan Dir';
            saveInputDir();
        }
    }
});

ipcRenderer.on('choosenInputFiles', (event, arg) => {
    console.log(arg);
    if(arg){
        if(arg[0]){
            inputfileslist = arg;
            document.getElementById("scaninputdir").innerHTML = `Scan ${inputfileslist.length} Files`;
            document.getElementById("inputdir").value = '';
            document.getElementById("inputdir").placeholder = 'FILES LIST - '+ inputfileslist.join();
        }
    }
});

ipcRenderer.on('scanInputDir', (event, arg) => {
    console.log(arg);
    var node = document.createElement("div");
    node.className = "activitylogitemsstart";
    var textnode;

    if(document.getElementById("inputdir").value){
        textnode = document.createTextNode(`SCANNING OF INPUT DIR: '${arg}' HAS BEGUN....PLEASE WAIT....`);
    }else{
        textnode = document.createTextNode(`SCANNING OF CHOSEN INPUT FILES HAS BEGUN....PLEASE WAIT....`);
    }

    node.appendChild(textnode);
    document.getElementById("activitylog").appendChild(node);
    node.scrollIntoView(false);
});

ipcRenderer.on('choosenOutputDir', (event, arg) => {
    console.log(arg);
    if(arg){
        document.getElementById("outputdir").value = arg;
        saveOutputDir()
    }
});

ipcRenderer.on('activity', (event, arg) => {
    console.log(arg);
    if(arg){
        if(arg[0]){
            arg.forEach((line) => {
                var node = document.createElement("div");

                if(line === 'probing input files using ffprobe:'){
                    videoprobingunderway = true;
                    node.className = "activitylogitemsstart";
                }
                if(line.indexOf('input files qty:') === 0){
                    inputvideoquetotallength = Number(line.split(':')[1]);
                    return;
                }
                if(line === 'done probing input files'){
                    videoprobingunderway = false;
                    document.getElementById("proxyjobprogress").value = "0";
                    node.className = "activitylogitemsdone";
                }
                if(line === 'started making proxies of all input files'){
                    videoproxingunderway = true;
                    // set the progress bar to just a little bit of blue so that the user feels shit has actually begun because people dont read
                    document.getElementById("proxyjobprogress").value = 1;

                    document.getElementById("startmakingproxies").disabled = true;
                    document.getElementById("pauseproxyjob").disabled = false;
                    document.getElementById("killproxyjob").disabled = false;
                    node.className = "activitylogitemsstart";
                }
                if(line === 'done making proxies of all input files'){
                    videoproxingunderway = false;
                    document.getElementById("startmakingproxies").disabled = false;
                    document.getElementById("pauseproxyjob").disabled = true;
                    document.getElementById("killproxyjob").disabled = true;
                    inputvideoquejobcounter = 1;
                    document.getElementById("fpsprogress").innerHTML = '';
                    document.getElementById("quelength").innerHTML = '';
                    document.getElementById("proxyjobprogress").value = "0";
                    node.className = "activitylogitemsdone";
                }
                if(line.indexOf('HTML video gallery file created at|') === 0){
                    var galleryfilewithpath = line.split('|')[1];
                    var textnode = document.createTextNode(line.split('|')[0] + ': '+line.split('|')[1]);
                    node.appendChild(textnode);
                    var button = document.createElement('button');
                    button.innerHTML = 'open';
                    button.onclick = function(){openGalleryFile(encodeURIComponent(galleryfilewithpath));}
                    button.className = "opengalleryfile";

                    node.appendChild(button);
                    document.getElementById("activitylog").appendChild(node);
                    node.scrollIntoView(false);
                    return;
                }

                var textnode = document.createTextNode(line);
                node.appendChild(textnode);
                document.getElementById("activitylog").appendChild(node);
                node.scrollIntoView(false);

            });

        }
    }
});

ipcRenderer.on('proxyMakingJobStatus', (event, arg) => {
    console.log(arg);
    if(arg){
        arg = arg.replace(/(\r\n|\n|\r)/gm, "");
        let proxystatus = JSON.parse(arg);
        console.log(proxystatus);
        let logline;
        let textnode;

        var node = document.createElement("div");

        if(proxystatus.status === 'started'){
            document.getElementById("quelength").innerHTML = ' building video proxy file: ' + inputvideoquejobcounter + ' of ' + inputvideoquetotallength;

            logline = 'STATUS: '+proxystatus.status + ' JOB: '+proxystatus.job;
            node.className = "activitylogitems";
            textnode = document.createTextNode(logline);
            node.appendChild(textnode);
            //node.innerHTML = logline.replaceAll(':\\','&#58;&#47;');
        }else
        if(proxystatus.status === 'complete'){
            //update progress bar
            let progresspercent = (100 / inputvideoquetotallength) * inputvideoquejobcounter;
            document.getElementById("proxyjobprogress").value = progresspercent;

            logline = 'STATUS: '+proxystatus.status + ' JOB: '+proxystatus.job;
            node.className = "activitylogitems";
            textnode = document.createTextNode(logline);
            //node.innerHTML = encodeURIComponent(logline);
            inputvideoquejobcounter++;
        }else
        if(proxystatus.status === 'alreadyexists'){
            logline = 'STATUS: '+proxystatus.alreadyexists ;
            node.className = "activitylogitemsalreadyexists";
            textnode = document.createTextNode(logline);
            //node.innerHTML = encodeURIComponent(logline);

            //update progress bar even for errored files
            let progresspercent = (100 / inputvideoquetotallength) * inputvideoquejobcounter;
            document.getElementById("proxyjobprogress").value = progresspercent;
            document.getElementById("quelength").innerHTML = ' building video proxy file: <span style="color:#FFB200">' + inputvideoquejobcounter + '</span> of ' + inputvideoquetotallength;
            inputvideoquejobcounter++;
        }else
        if(proxystatus.status === 'error'){
            logline = 'STATUS: '+proxystatus.status + ' ' + proxystatus.error_stderr+ ' JOB: '+proxystatus.job;
            node.className = "activitylogitemserror";
            textnode = document.createTextNode(logline);
            //node.innerHTML = encodeURIComponent(logline);

            //update progress bar even for errored files
            let progresspercent = (100 / inputvideoquetotallength) * inputvideoquejobcounter;
            document.getElementById("proxyjobprogress").value = progresspercent;
            document.getElementById("quelength").innerHTML = ' building video proxy file: <span style="color:red">' + inputvideoquejobcounter + '</span> of ' + inputvideoquetotallength;
            inputvideoquejobcounter++;
        }else
        if(proxystatus.status === 'working'){
            document.getElementById("fpsprogress").innerHTML = proxystatus.fps;
            return;
        }

        node.appendChild(textnode);
        document.getElementById("activitylog").appendChild(node);
        node.scrollIntoView(false);


    }
});

ipcRenderer.on('inputfilesprobe', (event, arg) => {
    if(arg){
        let fileprobeobject;

        try{
            fileprobeobject = JSON.parse(arg);

            //console.log(fileprobeobject);
            let leafname= fileprobeobject.format.filename.split('\\').pop().split('/').pop();
            let size = niceBytes(fileprobeobject.format.size);
            let width = 0;
            let height = 0;
            let fps = 0;
            let duration = 0;
            let creationdate;

            if(fileprobeobject.streams){

                let vidstreamindex;
                let streamcounter = 0;
                // determine which stream is video (this only finds 1 video stream and it will be the last one)
                fileprobeobject.streams.forEach((stream) => {
                    //console.log(stream.codec_type);
                    if(stream.codec_type.indexOf('video') == 0){
                        vidstreamindex = streamcounter;
                    }
                    streamcounter++;
                });

                if(fileprobeobject.streams[vidstreamindex]){
                    if(fileprobeobject.streams[vidstreamindex].width){
                        width = fileprobeobject.streams[vidstreamindex].width;
                    }
                    if(fileprobeobject.streams[vidstreamindex].height){
                        height = fileprobeobject.streams[vidstreamindex].height;
                    }
                    if(fileprobeobject.streams[vidstreamindex].r_frame_rate){// used to use metada param avg_frame_rate but it does not exist in prores
                        let framerate = fileprobeobject.streams[vidstreamindex].r_frame_rate.split('/');
                        fps = (framerate[0] / framerate[1]).toFixed(3);
                    }
                    if(fileprobeobject.format.duration && (fps > 0)){
                        duration = SMPTEToString(secondsToSMPTE(fileprobeobject.format.duration,fps));
                    }
                    if(fileprobeobject.format.tags.CREATION_TIME){
                        creationdate = fileprobeobject.format.tags.CREATION_TIME;
                    }
                    if(fileprobeobject.format.tags.modification_date){
                        creationdate = fileprobeobject.format.tags.modification_date;
                    }
                    if(fileprobeobject.format.tags.creation_time){
                        creationdate = fileprobeobject.format.tags.creation_time;
                    }
                }
            }

            var node = document.createElement("div");
            node.className = "activitylogitems";
            if(fileprobeobject.format.format_long_name === 'BAD MEDIA FILE'){
                node.innerHTML = `<span style="color:#F66464">${leafname} <b>${fileprobeobject.format.format_long_name}</b></span>`;
            }else{
                node.innerHTML = `${leafname} ${fileprobeobject.format.format_long_name} ${size} ${width} x ${height} ${fps}fps duration:${duration} creation date:${creationdate}`;
            }
            document.getElementById("activitylog").appendChild(node);
            node.scrollIntoView(false);

            if(fileprobeobject.format.format_name.indexOf('image') == -1){
                inputvideoque.push(fileprobeobject);
                document.getElementById("quelength").innerHTML = inputvideoque.length + ' video source files added to queue';
                document.getElementById("startmakingproxies").innerHTML = 'Start Making '+ inputvideoque.length + ' Proxies';

                //update progress bar
                let progresspercent = (100 / inputvideoquetotallength) * inputvideoque.length;
                document.getElementById("proxyjobprogress").value = progresspercent;
            }

        }catch(err){
            console.log("file probe was not successful");
        }
    }
});

ipcRenderer.on('killedProxyJob', (event, arg) => {
    //inputfileslist = [];
    //inputvideoque = [];
    //inputvideoquetotallength = 0;
    inputvideoquejobcounter = 1;
    videoprobingunderway = false;
    videoproxingunderway = false;

    document.getElementById("startmakingproxies").disabled = false;
    document.getElementById("pauseproxyjob").disabled = true;
    document.getElementById("killproxyjob").disabled = true;

    document.getElementById("proxyjobprogress").value = 0;

    var node = document.createElement("div");
    node.className = "activitylogitems";
    node.innerHTML = `<span style="color:#F66464"><b>----------JOB WAS CANCELLED BY USER---------</b></span>`;
    document.getElementById("activitylog").appendChild(node);
    node.scrollIntoView(false);
});

ipcRenderer.on('pausedProxyJob', (event, arg) => {

    document.getElementById("pauseproxyjob").disabled = false;
    document.getElementById("pauseproxyjob").innerHTML = 'Resume Proxy Job';

    var node = document.createElement("div");
    node.className = "activitylogitems";
    node.innerHTML = `<span style="color:#F4C45D"><b>----------JOB HAS BEEN PAUSED BY USER---------</b></span>`;
    document.getElementById("activitylog").appendChild(node);
    node.scrollIntoView(false);
});

ipcRenderer.on('resumedProxyJob', (event, arg) => {

    document.getElementById("killproxyjob").disabled = false;
    document.getElementById("pauseproxyjob").innerHTML = 'Pause Proxy Job';

    var node = document.createElement("div");
    node.className = "activitylogitems";
    node.innerHTML = `<span style="color:#F4C45D"><b>----------JOB HAS BEEN RESUMED BY USER---------</b></span>`;
    document.getElementById("activitylog").appendChild(node);
    node.scrollIntoView(false);
});

// ---------------- LISTENERS -----------------------------------
// settings changes:
document.getElementById("inputdir").addEventListener("change", saveInputDir);
document.getElementById("showinputdirhistory").addEventListener("click", showAllInputDirHistory);
document.getElementById("showoutputdirhistory").addEventListener("click", showAllOutputDirHistory);
document.getElementById("chooseinputdir").addEventListener("click", chooseInputDir);
document.getElementById("chooseinputfiles").addEventListener("click", chooseInputFiles);
document.getElementById("scaninputdir").addEventListener("click", scanInputDir);
document.getElementById("outputdir").addEventListener("change", saveOutputDir);
document.getElementById("chooseoutputdir").addEventListener("click", chooseOutputDir);
document.getElementById("outputwidth").addEventListener("change", setOutputWidth);
document.getElementById("outputheight").addEventListener("change", setOutputHeight);
document.getElementById("outputfps").addEventListener("change", setOutputFps);
document.getElementById("appendtoqueue").addEventListener("change", setAppendToQueue);
document.getElementById("onlymakenew").addEventListener("change", setOnlyMakeNew);
document.getElementById("autocrop").addEventListener("change", setAutoCrop);
document.getElementById("htmlgallery").addEventListener("change", setHtmlGallery);
document.getElementById("outputvideocontainer").addEventListener("change", setVideoContainer);
document.getElementById("outputvideocodec").addEventListener("change", setVideoCodec);
document.getElementById("outputvideopxlfmt").addEventListener("change", setVideoPxlFmt);
document.getElementById("outputvideopreset").addEventListener("change", setH264H265Preset);
document.getElementById("outputvideotune").addEventListener("change", setH264H265Tune);
document.getElementById("outputvideocrf").addEventListener("change", setH264H265CRF);
document.getElementById("outputvideoproresprofile").addEventListener("change", setProresProfile);
document.getElementById("outputvideoproresqscale").addEventListener("change", setProresQscale);
document.getElementById("faststartforwebvideo").addEventListener("change", setH264H265FastStart);
document.getElementById("hardwareacceleration").addEventListener("change", setHardwareAccel);
document.getElementById("outputaudiocodec").addEventListener("change", setAudioCodec);
document.getElementById("customffmpegoptions").addEventListener("change", setCustomFfmpegOptions);

document.getElementById("burnintext").addEventListener("change", function(){localStorage.setItem("burnintext",document.getElementById("burnintext").value);});
document.getElementById("burnintextlocation").addEventListener("change", function(){localStorage.setItem("burnintextlocation",document.getElementById("burnintextlocation").value);});
document.getElementById("burnintextsize").addEventListener("change", function(){localStorage.setItem("burnintextsize",document.getElementById("burnintextsize").value);});
document.getElementById("burnintextcolor").addEventListener("change", function(){localStorage.setItem("burnintextcolor",document.getElementById("burnintextcolor").value);});
document.getElementById("burnintextborder").addEventListener("change", function(){localStorage.setItem("burnintextborder",document.getElementById("burnintextborder").value);});
document.getElementById("burnintextbordercolor").addEventListener("change", function(){localStorage.setItem("burnintextbordercolor",document.getElementById("burnintextbordercolor").value);});
document.getElementById("burnintimecode").addEventListener("change", function(){localStorage.setItem("burnintimecode",document.getElementById("burnintimecode").checked);});
document.getElementById("burnintimecodelocation").addEventListener("change", function(){localStorage.setItem("burnintimecodelocation",document.getElementById("burnintimecodelocation").value);});
document.getElementById("burnintimecodesize").addEventListener("change", function(){localStorage.setItem("burnintimecodesize",document.getElementById("burnintimecodesize").value);});
document.getElementById("burnintimecodecolor").addEventListener("change", function(){localStorage.setItem("burnintimecodecolor",document.getElementById("burnintimecodecolor").value);});
document.getElementById("burnintimecodeborder").addEventListener("change", function(){localStorage.setItem("burnintimecodeborder",document.getElementById("burnintimecodeborder").value);});
document.getElementById("burnintimecodebordercolor").addEventListener("change", function(){localStorage.setItem("burnintimecodebordercolor",document.getElementById("burnintimecodebordercolor").value);});

// buttons:
document.getElementById("startmakingproxies").addEventListener("click", startMakingProxies);
document.getElementById("advanced").addEventListener("click", showAdvancedSettings);
document.getElementById("pauseproxyjob").addEventListener("click", pauseOrResumeProxyJob);
document.getElementById("killproxyjob").addEventListener("click", killProxyJob);

document.getElementById("showabouthelp").addEventListener("click", showAboutHelp);
document.getElementById("showonlyoneinputleveldeephelp").addEventListener("click", showOnlyOneInputLevelDeepHelp);
document.getElementById("showoutputfpshelp").addEventListener("click", showOutputFpsHelp);
document.getElementById("showappendtoqueuehelp").addEventListener("click", showAppendToQueueHelp);
document.getElementById("showonlymakenewfileshelp").addEventListener("click", showOnlyMakeNewFilesHelp);
document.getElementById("showautocrophelp").addEventListener("click", showAutoCropHelp);
document.getElementById("showcreatehtmlgalleryhelp").addEventListener("click", showCreateHtmlGalleryHelp);
document.getElementById("showfilecontainerhelp").addEventListener("click", showFileContainerHelp);
document.getElementById("showvideocodecshelp").addEventListener("click", showVideoCodecsHelp);
document.getElementById("showpixfmthelp").addEventListener("click", showPixFmtHelp);
document.getElementById("showh264h265presethelp").addEventListener("click", showH264h265PresetHelp);
document.getElementById("showh264h265tunehelp").addEventListener("click", showH264h265TuneHelp);
document.getElementById("showh264h265crfhelp").addEventListener("click", showH264h265CrfHelp);
document.getElementById("showh264h265faststarthelp").addEventListener("click", showH264h265FaststartHelp);
document.getElementById("showproresprofilehelp").addEventListener("click", showProresProfileHelp);
document.getElementById("showproresqscalehelp").addEventListener("click", showProresQscaleHelp);
document.getElementById("showaudiocodechelp").addEventListener("click", showAudiocodecHelp);
document.getElementById("showcustomeffmpegoptionshelp").addEventListener("click", showCustomeFfmpegOptionsHelp);
document.getElementById("showhardwareaccelhelp").addEventListener("click", showHardwareAccelHelp);
document.getElementById("showburninhelp").addEventListener("click", showBurnInHelp);

document.querySelectorAll(".helpboxcloser").forEach(i => i.addEventListener("click",e => {hideHelp();}));

// ---------------- FUNCTIONS -----------------------------------

function pauseOrResumeProxyJob(){
    ipcRenderer.send('runbackendcommand', {command:'pauseOrResumeProxyJob'});
}

function killProxyJob(){
    ipcRenderer.send('runbackendcommand', {command:'killProxyJob'});
}

function showAllInputDirHistory(){
    var datalist = document.getElementById("inputlist");
    var input = document.getElementById("inputdir");
    datalist.style.display = 'block';
    datalist.style.width = input.offsetWidth + 'px';
    datalist.style.left = input.offsetLeft + 'px';
    datalist.style.top = input.offsetTop + input.offsetHeight + 'px';
}

function showAllOutputDirHistory(){
    var datalist = document.getElementById("outputlist");
    var output = document.getElementById("outputdir");
    datalist.style.display = 'block';
    datalist.style.width = output.offsetWidth + 'px';
    datalist.style.left = output.offsetLeft + 'px';
    datalist.style.top = output.offsetTop + output.offsetHeight + 'px';
}

function loadInputDirHistory(){
    var datalist = document.getElementById("inputlist");
    datalist.innerHTML = '';

    let inputhistorylist = JSON.parse(localStorage.proxy_input_dir_history);
    if(inputhistorylist.length > 0){
        inputhistorylist.forEach(function(oldpath){
            var optionNode =  document.createElement("option");
            optionNode.value = oldpath;
            optionNode.appendChild(document.createTextNode(oldpath));
            datalist.appendChild(optionNode);

            optionNode.onclick = function () {
                document.getElementById("inputdir").value = oldpath;
                datalist.style.display = 'none';
                saveInputDir();
                document.getElementById("scaninputdir").innerHTML = 'Scan Dir';
            }
        });
    }
}

function saveInputDir(){
    var newinputdir = document.getElementById("inputdir").value;
    if(newinputdir){
        localStorage.setItem("proxy_input_last_dir", newinputdir);
        let inputhistorylist;
        if (localStorage.proxy_input_dir_history){
            inputhistorylist = JSON.parse(localStorage.proxy_input_dir_history);
            if(inputhistorylist.length > 0){
                if(inputhistorylist.indexOf(newinputdir) == -1) {
                    inputhistorylist.push(newinputdir);
                }
            }
        }else{
            inputhistorylist = [newinputdir];
        }
        if(inputhistorylist.length > 0){
            localStorage.setItem("proxy_input_dir_history", JSON.stringify(inputhistorylist));

            loadInputDirHistory();
        }
    }
}

function chooseInputDir(){
    let msg;
    if (localStorage.proxy_input_last_dir){
        msg = {command:'chooseInputDir',setting:localStorage.proxy_input_last_dir};
    }else{
        msg = {command:'chooseInputDir'};
    }
    ipcRenderer.send('runbackendcommand', msg);
}

function chooseInputFiles(){
    let msg;
    if (localStorage.proxy_input_last_dir){
        msg = {command:'chooseInputFiles',setting:localStorage.proxy_input_last_dir};
    }else{
        msg = {command:'chooseInputFiles'};
    }
    ipcRenderer.send('runbackendcommand', msg);
}

function scanInputDir(){
    if((document.getElementById("inputdir").value === '') && (inputfileslist.length === 0)){
        alert('No input directory or files have been chosen yet.');
        return;
    }
    if(document.getElementById("appendtoqueue").checked){
        //we do NOT empty the queue
    }else{
        inputvideoque = []; // clear the que
    }
    if(inputfileslist.length > 0){
        ipcRenderer.send('runbackendcommand', {command:'scanInputDir',setting:inputfileslist, depthsetting:document.getElementById("onlyoneinputleveldeep").checked});
        inputfileslist = [];
    }else{
        ipcRenderer.send('runbackendcommand', {command:'scanInputDir',setting:localStorage.proxy_input_last_dir, depthsetting:document.getElementById("onlyoneinputleveldeep").checked});
    }
}

function loadOutputDirHistory(){
    var datalist = document.getElementById("outputlist");
    datalist.innerHTML = '';

    let outputhistorylist = JSON.parse(localStorage.proxy_output_dir_history);
    if(outputhistorylist.length > 0){
        outputhistorylist.forEach(function(oldpath){
            var optionNode =  document.createElement("option");
            optionNode.value = oldpath;
            optionNode.appendChild(document.createTextNode(oldpath));
            datalist.appendChild(optionNode);

            optionNode.onclick = function () {
                document.getElementById("outputdir").value = oldpath;
                datalist.style.display = 'none';
                saveOutputDir();
            }
        });
    }
}

function saveOutputDir(){
    var newoutputdir = document.getElementById("outputdir").value;
    if(newoutputdir){
        localStorage.setItem("proxy_output_last_dir", newoutputdir);
        let outputhistorylist;
        if (localStorage.proxy_output_dir_history){
            outputhistorylist = JSON.parse(localStorage.proxy_output_dir_history);
            if(outputhistorylist.length > 0){
                if(outputhistorylist.indexOf(newoutputdir) == -1) {
                    outputhistorylist.push(newoutputdir);
                }
            }
        }else{
            outputhistorylist = [newoutputdir];
        }
        if(outputhistorylist.length > 0){
            localStorage.setItem("proxy_output_dir_history", JSON.stringify(outputhistorylist));

            loadOutputDirHistory();
        }
    }
}

function chooseOutputDir(){
    let msg;
    if (localStorage.proxy_output_last_dir){
        msg = {command:'chooseOutputDir',setting:localStorage.proxy_output_last_dir};
    }else{
        msg = {command:'chooseOutputDir',setting:''};
    }
    ipcRenderer.send('runbackendcommand', msg);
}

function setOutputWidth(){
    localStorage.setItem("proxy_output_last_width",document.getElementById("outputwidth").value);
}

function setOutputHeight(){
    localStorage.setItem("proxy_output_last_height",document.getElementById("outputheight").value);
}

function setOutputFps(){
    localStorage.setItem("proxy_output_last_fps",document.getElementById("outputfps").value);
}

function setAppendToQueue(){
    localStorage.setItem("proxy_last_append_to_queue",document.getElementById("appendtoqueue").checked);
}

function setOnlyMakeNew(){
    localStorage.setItem("proxy_last_only_make_new",document.getElementById("onlymakenew").checked);
}

function setAutoCrop(){
    localStorage.setItem("proxy_last_auto_crop",document.getElementById("autocrop").checked);
}

function setHtmlGallery(){
    localStorage.setItem("htmlgallery",document.getElementById("htmlgallery").checked);
}

function setVideoContainer(){
    localStorage.setItem("outputvideocontainer",document.getElementById("outputvideocontainer").value);
}

function setVideoCodec(){
    // adding notification here for pixfmt
    var vcodec = document.getElementById("outputvideocodec").value;
    if(vcodec === 'prores_ks'){
        localStorage.setItem("outputvideopxlfmt","yuv422p10le");
        document.getElementById("outputvideopxlfmt").value = 'yuv422p10le';
        alert('Because you have chosen Prores, we are automatically setting the pixel format to "yuv422p10le", but you can change this to "yuv444p10le" or "yuva444p10le". Setting this to any other value will create failure and painful learning.');

        localStorage.setItem("outputvideocontainer","mov");
        document.getElementById("outputvideocontainer").value = 'mov';
        alert('Because you have chosen Prores, we are automatically setting the container format to "mov", but you can change this to "mkv" or "mxf". Setting this to any other value will create failure and painful learning.');

        localStorage.setItem("outputaudiocodec","pcm_s16le");
        document.getElementById("outputaudiocodec").value = 'pcm_s16le';
        alert('Because you have chosen Prores, we are automatically setting the audio codec to "pcm_s16le", but you can change this to other vdalues. Good luck.');

        alert('Understand that ProRes video does NOT play in any browser except Safari on Mac so if you are creating a gallery html all the videos will look broken if you open that gallery in a different browser. When we open the gallery for you after you click the little white open button, we are opening the default system browser which may or may not be Safari.');
    }
    if(vcodec === 'libx264'){
        localStorage.setItem("outputvideopxlfmt","yuv420p");
        document.getElementById("outputvideopxlfmt").value = 'yuv420p';

        localStorage.setItem("outputvideocontainer","mp4");
        document.getElementById("outputvideocontainer").value = 'mp4';

        localStorage.setItem("outputaudiocodec","aac");
        document.getElementById("outputaudiocodec").value = 'aac';
    }
    localStorage.setItem("outputvideocodec",document.getElementById("outputvideocodec").value);
}

function setVideoPxlFmt(){
    localStorage.setItem("outputvideopxlfmt",document.getElementById("outputvideopxlfmt").value);
}

function setH264H265Preset(){
    localStorage.setItem("outputvideopreset",document.getElementById("outputvideopreset").value);
}

function setH264H265Tune(){
    localStorage.setItem("outputvideotune",document.getElementById("outputvideotune").value);
}

function setH264H265CRF(){
    localStorage.setItem("outputvideocrf",document.getElementById("outputvideocrf").value);
}

function setProresProfile(){
    localStorage.setItem("outputvideoproresprofile",document.getElementById("outputvideoproresprofile").value);
}

function setProresQscale(){
    localStorage.setItem("outputvideoproresqscale",document.getElementById("outputvideoproresqscale").value);
}

function setH264H265FastStart(){
    localStorage.setItem("faststartforwebvideo",document.getElementById("faststartforwebvideo").checked);
}

function setHardwareAccel(){
    localStorage.setItem("hardwareacceleration",document.getElementById("hardwareacceleration").checked);
}

function setAudioCodec(){
    localStorage.setItem("outputaudiocodec",document.getElementById("outputaudiocodec").value);
}

function setCustomFfmpegOptions(){
    localStorage.setItem("customffmpegoptions",document.getElementById("customffmpegoptions").value);
}

function startMakingProxies(){
    console.log('startMakingProxies');
    if(inputvideoque.length === 0){
        alert('no files in the queue to process yet');
        return;
    }
    if(!localStorage.proxy_output_last_dir){
        alert('no output directory choosen yet');
        return;
    }
    if(!localStorage.proxy_output_last_width){
        alert('no output width has been set yet');
        return;
    }
    if(!localStorage.proxy_output_last_height){
        alert('no output height has been set yet');
        return;
    }
    if(videoprobingunderway === true){
        alert('wait until the input files are finished being probed');
        return;
    }
    if(videoproxingunderway === true){
        return;
    }
    //the inputvideoque will need to be parsed file by file (each array item is a json object describing the media)
    // the correct ffmpeg command for converting each file into a proxy file will need to be created
    // for each file potential autocropping might need to be calculated and the proper ffmpeg options made
    let autocrop = JSON.parse(localStorage.proxy_last_auto_crop);

    let proxyjobconversioncommands = [];
    let galleryfiles = [];

    inputvideoque.forEach((videosourcefile) => {

        let leafname= videosourcefile.format.filename.split('\\').pop().split('/').pop();
        let width = 0;
        let height = 0;

        let vidstreamindex;
        let streamcounter = 0;

        videosourcefile.streams.forEach((stream) => {
            if(stream.codec_type.indexOf('video') == 0){
                vidstreamindex = streamcounter;
            }
            streamcounter++;
        });

        if(videosourcefile.streams[vidstreamindex]){
            if(videosourcefile.streams[vidstreamindex].width){
                width = videosourcefile.streams[vidstreamindex].width;
            }
            if(videosourcefile.streams[vidstreamindex].height){
                height = videosourcefile.streams[vidstreamindex].height;
            }
        }

        let videofilter = '';

        // if auto crop is on then we need to do some calcs:
        if(autocrop){
            // first we compare the output aspect ratio to the input aspect ratio if they are the same then there is nothing to do cropwise
            let inputaspectratio = Number(width / height);
            let outputaspectratio = Number(localStorage.proxy_output_last_width / localStorage.proxy_output_last_height);
            let percentdiff = absPercentDiff(inputaspectratio, outputaspectratio);
            // I think anything less than a 1.5% aspect ratio change is unnoticable and not worth fucking around with, in which case
            // we ignore the cropping that would be asked for by the autocrop feature on
            if(percentdiff > 1.5){
                // we need to apply the aspect ratio of the output to the input in both directions W or H as more important
                if(outputaspectratio > inputaspectratio){// need to crop top and bottom (crop height)
                    // solve for a new input height
                    let croppedinputheight = Math.round(width / outputaspectratio);
                    console.log('outputaspectratio '+outputaspectratio+' is greater than inputaspectratio '+inputaspectratio+' will crop height to '+croppedinputheight);
                    videofilter = 'crop='+width+':'+croppedinputheight+',';
                }
                if(inputaspectratio > outputaspectratio){// need to crop left and right (crop width)
                    // solve for a new input width
                    let croppedinputwidth = Math.round(height * outputaspectratio);
                    console.log('inputaspectratio '+inputaspectratio+' is greater than outputaspectratio '+outputaspectratio+' will crop width to '+croppedinputwidth);
                    videofilter = 'crop='+croppedinputwidth+':'+height+',';
                }

            }
        }

        // here we add the scale to the video filter. it is either ONLY scaling OR scale AfTER crop
        videofilter = videofilter + 'scale='+localStorage.proxy_output_last_width+':'+localStorage.proxy_output_last_height;

        // adding burn in text if box is filled
        let burnintext = document.getElementById("burnintext").value;
        if(burnintext){
            let burnintextsize = document.getElementById("burnintextsize").value;
            let burnintextcolor = document.getElementById("burnintextcolor").getAttribute('data-current-color');
            let burnintextborder = document.getElementById("burnintextborder").value;
            let burnintextbordercolor = document.getElementById("burnintextbordercolor").getAttribute('data-current-color');
            let burnintextlocation = document.getElementById("burnintextlocation").value;
            let locx;
            let locy;
            if(burnintextlocation === 'DC'){
                 locx = '(w-text_w)/2';
                 locy = '(h-text_h)/2';
            }
            if(burnintextlocation === 'UL'){
                 locx = '3';
                 locy = '3';
            }
            if(burnintextlocation === 'LL'){
                 locx = '3';
                 locy = '(h-text_h-3)';
            }
            if(burnintextlocation === 'LR'){
                 locx = '(w-text_w-3)';
                 locy = '(h-text_h-3)';
            }
            if(burnintextlocation === 'UR'){
                 locx = '(w-text_w-3)';
                 locy = '3';
            }

            videofilter = videofilter + ",drawtext=text=\\'"+burnintext+"\\':fontcolor="+burnintextcolor+":fontsize="+burnintextsize+":bordercolor="+burnintextbordercolor+":borderw="+burnintextborder+":x="+locx+":y="+locy;

        }

        // add in burn in timecode if checked
        if(document.getElementById("burnintimecode").checked){
            let burnintimecodesize = document.getElementById("burnintimecodesize").value;
            let burnintimecodecolor = document.getElementById("burnintimecodecolor").getAttribute('data-current-color');
            let burnintimecodeborder = document.getElementById("burnintimecodeborder").value;
            let burnintimecodebordercolor = document.getElementById("burnintimecodebordercolor").getAttribute('data-current-color');
            let burnintimecodelocation = document.getElementById("burnintimecodelocation").value;
            let locx;
            let locy;
            if(burnintimecodelocation === 'DC'){
                 locx = '(w-text_w)/2';
                 locy = '(h-text_h)/2';
            }
            if(burnintimecodelocation === 'UL'){
                 locx = '3';
                 locy = '3';
            }
            if(burnintimecodelocation === 'LL'){
                 locx = '3';
                 locy = '(h-text_h-3)';
            }
            if(burnintimecodelocation === 'LR'){
                 locx = '(w-text_w-3)';
                 locy = '(h-text_h-3)';
            }
            if(burnintimecodelocation === 'UR'){
                 locx = '(w-text_w-3)';
                 locy = '3';
            }
            let creationdate;
            if(videosourcefile.format.tags.CREATION_TIME){
                creationdate = videosourcefile.format.tags.CREATION_TIME;
            }
            if(videosourcefile.format.tags.modification_date){
                creationdate = videosourcefile.format.tags.modification_date;
            }
            if(videosourcefile.format.tags.creation_time){
                creationdate = videosourcefile.format.tags.creation_time;
            }

            // 'pts' will give you the actual timestamp but leave out seconds. you have to get the creation_time metadata first and convert it to epoch seconds (then subtract the epochseconds of the date) and give that as the last param
            // example: epoch of 2021-06-15T12:10:18.000000Z = 1623759018 minus epoch of Start of day:   1623715200  Tuesday, June 15, 2021 12:00:00 AM = 43818

            let creationdateonscreen = '';
            let timecodeoffset = 0;
            if(creationdate){
                creationdateonscreen = creationdate.substr(0,10);

                let creationdatetimestamp = Math.floor((new Date(creationdate)).getTime()/1000.0);
                let creationdatestamp = Math.floor((new Date(creationdate.substr(0,10))).getTime()/1000.0);
                timecodeoffset = creationdatetimestamp - creationdatestamp;
            }

            videofilter = videofilter + ",drawtext=text=\\'"+creationdateonscreen+" %{pts : hms : "+timecodeoffset+"}\\':fontcolor="+burnintimecodecolor+":fontsize="+burnintimecodesize+":bordercolor="+burnintimecodebordercolor+":borderw="+burnintimecodeborder+":x="+locx+":y="+locy;
        }

        //let proxyfilewithpath = localStorage.proxy_output_last_dir+'/'+leafname.split('.').slice(0, -1).join('.')+'.mp4';
        let proxyfilewithpath = localStorage.proxy_output_last_dir+'/'+leafname.split('.').slice(0, -1).join('.')+'.'+localStorage.outputvideocontainer;

        let overwrite = '-y';
        if(localStorage.proxy_last_only_make_new === 'true'){
            overwrite = '-n';
        }

        let audiocodec = '';
        if(localStorage.outputaudiocodec === 'none'){
            audiocodec = '-an';
        }else{
            audiocodec = '-c:a|'+localStorage.outputaudiocodec;
        }

        let videocodec = localStorage.outputvideocodec;

        let crf = '';
        if(localStorage.outputvideocodec === 'libx264' || localStorage.outputvideocodec === 'libx264rgb' || localStorage.outputvideocodec === 'libx265'){
            crf = '-crf|'+ localStorage.outputvideocrf;
        }

        let preset = '';
        if(localStorage.outputvideocodec === 'libx264' || localStorage.outputvideocodec === 'libx264rgb' || localStorage.outputvideocodec === 'libx265'){
            preset = '-preset|'+ localStorage.outputvideopreset;
        }

        let tune = '';
        if(localStorage.outputvideocodec === 'libx264' || localStorage.outputvideocodec === 'libx264rgb' || localStorage.outputvideocodec === 'libx265'){
            if(localStorage.outputvideotune !== 'none'){
                tune = '-tune|'+ localStorage.outputvideotune;
            }
        }

        let faststart = '';
        if(localStorage.outputvideocodec === 'libx264' || localStorage.outputvideocodec === 'libx264rgb' || localStorage.outputvideocodec === 'libx265'){
            if(document.getElementById("faststartforwebvideo").checked){
                faststart = '-movflags|+faststart|';
            }
        }

        let outputvideoproresprofile = '';
        if(localStorage.outputvideocodec === 'prores_ks'){
            outputvideoproresprofile = '-vendor|apl0|-profile:v|'+localStorage.outputvideoproresprofile;
        }

        let outputvideoproresqscale = '';
        if(localStorage.outputvideocodec === 'prores_ks'){
            outputvideoproresqscale = '-qscale:v|'+localStorage.outputvideoproresqscale;
        }

        let customffmpeg = '';
        if(document.getElementById("customffmpegoptions").value){
            customffmpeg = document.getElementById("customffmpegoptions").value;
        }

        let pixfmt = '';
        if(localStorage.outputvideopxlfmt){
            pixfmt = '-pix_fmt|'+localStorage.outputvideopxlfmt;
        }

        let hardwareacceleration = '';
        if(document.getElementById("hardwareacceleration").checked){
            hardwareacceleration = '-hwaccel|auto';
        }

        let outputfps = '';
        if(localStorage.proxy_output_last_fps){
            outputfps = '-r|'+localStorage.proxy_output_last_fps;
        }

        let ffmpegcommand = `-hide_banner|-stats|${hardwareacceleration}|${overwrite}|-i|${videosourcefile.format.filename}|-movflags|use_metadata_tags|${pixfmt}|-vf|${videofilter}|${audiocodec}|-c:v|${videocodec}|${outputvideoproresprofile}|${outputvideoproresqscale}|${preset}|${tune}|${faststart}|${crf}|${customffmpeg}|${outputfps}|${proxyfilewithpath}`;

        console.log(ffmpegcommand);
        ffmpegcommand = ffmpegcommand.replaceAll('||','|').replaceAll('||','|').replaceAll('||','|');
        console.log(ffmpegcommand);

        proxyjobconversioncommands.push(ffmpegcommand);
        galleryfiles.push(proxyfilewithpath);

    });

    console.log(proxyjobconversioncommands);

    let msg = {command:'startMakingProxies',jobdetails: JSON.stringify(proxyjobconversioncommands),htmlgallery: `{"create":${localStorage.htmlgallery},"outputpath":"${localStorage.proxy_output_last_dir}","galleryfiles":`+JSON.stringify(galleryfiles)+'}'};
    ipcRenderer.send('runbackendcommand', msg);
}


// -------------------------------- show hide functions -----------------------------------------
function showAdvancedSettings(){
    if(document.getElementById("advancedsettings").style.display === "none"){
        document.getElementById("advancedsettings").style.display = "block";
        document.getElementById("advanced").innerHTML = "Hide Advanced";
    }else{
        document.getElementById("advancedsettings").style.display = "none";
        document.getElementById("advanced").innerHTML = "Show Advanced";
    }
}

function hideHelp(){
    console.log("hideHelp");
    document.querySelectorAll('.helpbox').forEach(function(el) {
        el.style.display = 'none';
    });
}

function showAboutHelp(){
    if(document.getElementById("abouthelp").style.display === "none"){
        document.getElementById("abouthelp").style.display = "block";
    }
}
function showOutputFpsHelp(){
    if(document.getElementById("outputfpshelp").style.display === "none"){
        document.getElementById("outputfpshelp").style.display = "block";
    }
}
function showAppendToQueueHelp(){
    if(document.getElementById("appendtoqueuehelp").style.display === "none"){
        document.getElementById("appendtoqueuehelp").style.display = "block";
    }
}
function showOnlyOneInputLevelDeepHelp(){
    if(document.getElementById("onlyoneinputleveldeephelp").style.display === "none"){
        document.getElementById("onlyoneinputleveldeephelp").style.display = "block";
    }
}
function showOnlyMakeNewFilesHelp(){
    if(document.getElementById("onlymakenewfileshelp").style.display === "none"){
        document.getElementById("onlymakenewfileshelp").style.display = "block";
    }
}
function showAutoCropHelp(){
    if(document.getElementById("autocrophelp").style.display === "none"){
        document.getElementById("autocrophelp").style.display = "block";
    }
}
function showCreateHtmlGalleryHelp(){
    if(document.getElementById("createhtmlgalleryhelp").style.display === "none"){
        document.getElementById("createhtmlgalleryhelp").style.display = "block";
    }
}
function showFileContainerHelp(){
    if(document.getElementById("filecontainerhelp").style.display === "none"){
        document.getElementById("filecontainerhelp").style.display = "block";
    }
}
function showVideoCodecsHelp(){
    if(document.getElementById("videocodechelp").style.display === "none"){
        document.getElementById("videocodechelp").style.display = "block";
    }
}
function showPixFmtHelp(){
    if(document.getElementById("pixelformathelp").style.display === "none"){
        document.getElementById("pixelformathelp").style.display = "block";
    }
}
function showH264h265PresetHelp(){
    if(document.getElementById("h264h265presethelp").style.display === "none"){
        document.getElementById("h264h265presethelp").style.display = "block";
    }
}
function showH264h265TuneHelp(){
    if(document.getElementById("h264h265tunehelp").style.display === "none"){
        document.getElementById("h264h265tunehelp").style.display = "block";
    }
}
function showH264h265CrfHelp(){
    if(document.getElementById("h264h265crfhelp").style.display === "none"){
        document.getElementById("h264h265crfhelp").style.display = "block";
    }
}
function showH264h265FaststartHelp(){
    if(document.getElementById("h264h265faststarthelp").style.display === "none"){
        document.getElementById("h264h265faststarthelp").style.display = "block";
    }
}
function showProresProfileHelp(){
    if(document.getElementById("proresprofilehelp").style.display === "none"){
        document.getElementById("proresprofilehelp").style.display = "block";
    }
}
function showProresQscaleHelp(){
    if(document.getElementById("proresqscalehelp").style.display === "none"){
        document.getElementById("proresqscalehelp").style.display = "block";
    }
}
function showAudiocodecHelp(){
    if(document.getElementById("audiocodechelp").style.display === "none"){
        document.getElementById("audiocodechelp").style.display = "block";
    }
}
function showCustomeFfmpegOptionsHelp(){
    if(document.getElementById("customffmpegoptionshelp").style.display === "none"){
        document.getElementById("customffmpegoptionshelp").style.display = "block";
    }
}
function showHardwareAccelHelp(){
    if(document.getElementById("hardwareaccelhelp").style.display === "none"){
        document.getElementById("hardwareaccelhelp").style.display = "block";
    }
}
function showBurnInHelp(){
    if(document.getElementById("burninhelp").style.display === "none"){
        document.getElementById("burninhelp").style.display = "block";
    }
}

function openGalleryFile(galleryfile){
    ipcRenderer.send('runbackendcommand', {command:'openGalleryFile',htmlgallery: galleryfile});
}


// -------------------------------- util functions -----------------------------------------
function absPercentDiff(a, b){
    return  100 * Math.abs( ( a - b ) / ( (a+b)/2 ) );
}

function niceBytes(x){
    const units = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    let l = 0, n = parseInt(x, 10) || 0;

    while(n >= 1024 && ++l){
        n = n/1024;
    }

    return(n.toFixed(n < 10 && l > 0 ? 1 : 0) + ' ' + units[l]);
}

/** Convert seconds to SMPTE timecode JSON object, example input is html video.currentTime */
// usage SMPTEToString(secondsToSMPTE(seconds,fps)
function secondsToSMPTE(seconds, framerate) {
    var f = Math.floor((seconds % 1) * framerate);
    var s = Math.floor(seconds);
    var m = Math.floor(s / 60);
    var h = Math.floor(m / 60);
    m = m % 60;
    s = s % 60;

    return {h: h, m: m, s: s, f: f};
}

/** Pretty print SMPTE timecode JSON object */
function SMPTEToString(timecode) {
    if (timecode.h < 10) { timecode.h = "0" + timecode.h; }
    if (timecode.m < 10) { timecode.m = "0" + timecode.m; }
    if (timecode.s < 10) { timecode.s = "0" + timecode.s; }
    if (timecode.f < 10) { timecode.f = "0" + timecode.f; }

    return timecode.h + ":" + timecode.m + ":" + timecode.s + ":" + timecode.f;
}
