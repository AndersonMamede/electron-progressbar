const {app} = require('electron');
const ProgressBar = require('electron-progressbar');

app.on('ready', function() {
	var progressBar = new ProgressBar({
		text: 'Preparing data...',
		detail: 'Wait...'
	});
	
	progressBar
		.on('completed', function() {
			console.info(`completed...`);
			progressBar.detail = 'Task completed. Exiting...';
		})
		.on('aborted', function() {
			console.info(`aborted...`);
		});
	
	// launch a task...
	// launchTask();
	
	// when task is completed, set the progress bar to completed
	// ps: setTimeout is used here just to simulate an interval between the start and the end of a task
	setTimeout(function() {
		progressBar.setCompleted();
	}, 3000);
});