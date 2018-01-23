const {app, BrowserWindow, dialog} = require('electron');
const ProgressBar = require('electron-progressbar');

app.on('ready', function() {
	var mainWindow = new BrowserWindow({
		width: 1000,
		height: 500
	});
	
	var progressBar = new ProgressBar({
		text: 'Preparing data...',
		detail: 'Wait...',
		browserWindow: {
			parent: mainWindow
		}
	});
	
	progressBar
		.on('completed', function() {
			console.info(`completed...`);
			progressBar.detail = 'Task completed. Exiting...';
		})
		.on('aborted', function() {
			console.info(`aborted...`);
			
			// if user abort the progress bar (e.g. ALT+F4), show warning and then close the main window
			dialog.showMessageBox(mainWindow, {
				type: 'warning',
				title: 'Task aborted',
				message: 'Task was aborted.',
				detail: 'Exiting...'
			}, function(){
				mainWindow.close();
			});
		});
	
	// launch a task...
	// launchTask();
	
	// and when task if completed, set the progress bar to completed
	// ps: setTimeout is used here just to simulate an interval between the start and the end of a task
	setTimeout(function() {
		progressBar.setCompleted();
	}, 3000);
});