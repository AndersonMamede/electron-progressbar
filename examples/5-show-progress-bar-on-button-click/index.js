const {app, BrowserWindow, ipcMain} = require('electron');
const ProgressBar = require('electron-progressbar');

let mainWindow;
let progressBar;

app.on('ready', function() {
	mainWindow = new BrowserWindow({
		width : 300,
		height : 200
	});
	
	mainWindow.loadURL(`file://${__dirname}/test_page.html`);
	
	ipcMain.on('show-progressbar', showProgressbar);
	
	ipcMain.on('set-progressbar-completed', setProgressbarCompleted);
});

function showProgressbar () {
	if (progressBar) {
		return;
	}
	
	progressBar = new ProgressBar({
		text: 'Preparing data...',
		detail: 'Wait...',
		browserWindow: {
			parent: mainWindow
		}
	});
	
	progressBar
		.on('completed', function() {
			progressBar.detail = 'Task completed. Exiting...';
			progressBar = null;
		});
	
	// launch the task...
	// launchTask();
}

function setProgressbarCompleted () {
	if (progressBar) {
		progressBar.setCompleted();
	}
}