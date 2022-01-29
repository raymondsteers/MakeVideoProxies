# MakeVideoProxies

## Why:
Designed for DIY filmmakers and video content creators. Especially useful for shooting in remote locations where you would not want to bring an expensive laptop, and an older low power laptop you would bring is not capable of running NLE's like Adobe Premiere or Davinci Resolve or playing back HD files smoothly. This program can be used to batch convert video camera source files into smaller, more easily playable files. (In reality you could use it to convert any video file into any other kind and size of video file, uprezzing, codec conversion, frame rate conversion, etc. but those use cases are up to you to explore).

## Features:
- Video and audio codec conversion
- Resolution conversion
- Auto-cropping and scaling
- Frame rate conversion
- Pixel format conversion
- Apple ProRes input/output on both Mac and Windows
- Burn-in of text and timecode with custom colors, sizes, position, and opacity
- Batch Jobs of multiple files
- Adding of entire directories or individual files to the input processing queue
- Detection of creation date via video metadata for use in correct timecode offsets.
- HTML video gallery files

## With What:
The application is written in [Electron](https://www.electronjs.org/) and uses [electron-builder](https://github.com/electron-userland/electron-builder) to build installables for both Mac and Windows. All the heavy lifting for videoprocessing is done by [FFMPEG](https://ffmpeg.org/) and initial scanning of video files done by [FFPROBE](https://ffmpeg.org/ffprobe.html)

## Development:
Development was done on a MacBookPro using a Windows10 VirtualBox VM to compile the Windows version. To simplify and separate the process, 2 directories were used, one for the Mac code and one for Windows and then the html, js, css files in the mac dev dir were symlinked into the win dev dir. That win dev dir was shared into the Windows VM. The only file that lives in the Windows dev dir that is crucially different is the package.json file as the windows version requires an extra npm module called [ntsuspend](https://www.npmjs.com/package/ntsuspend). Yes there are other ways to deal with cross compiling and building apps for multiple platforms but this way works really well. You of course are welcome to build in any way that works for you. If you are on windows then just delete the package.json file and rename the package.json4windows to package.json.

## Running and Building
You should really read all the Electron and electron-builder docs to get this stuff right, but suffice to say you need node, npm, and yarn installed. The on the command line inside the working directory to start the app just:

```npm start```

and to build the distributable:

```yarn app:dist```

## Enabling DevTools WebInspector
During development you will be greatly helped by commenting out the following lines which will create a separate window allowing you to use the Chromium DevTools:

in main.js:
```javascript
//let devtools = null;
//devtools = new BrowserWindow();
//mainWindow.webContents.setDevToolsWebContents(devtools.webContents);
//mainWindow.webContents.openDevTools();
```

## Planned Upcoming Features
- online dailies:
  - custom naming of gallery html files including date/time stamping and incrementing
  - upload of galleries to online sharing services like gdrive, wetransfer, dropbox, etc.
  - html gallery consumer input and feedback of which videos are good / bad / ugly / keepers, etc.

