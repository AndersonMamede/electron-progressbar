const {app} = require('electron');
const ProgressBar = require('electron-progressbar');

app.on('ready', function() {
	var progressBar = new ProgressBar({
		indeterminate: false,
		text: 'Preparing data...',
		detail: 'Wait...'
	});
	
	progressBar
		.on('completed', function() {
			console.info(`completed...`);
			progressBar.detail = 'Task completed. Exiting...';
		})
		.on('aborted', function(value) {
			console.info(`aborted... ${value}`);
		})
		.on('progress', function(value) {
			progressBar.detail = `Value ${value} out of ${progressBar.getOptions().maxValue}...`;
		});
	
	// launch a task and set the value of the progress bar each time a part of the task is done;
	// the progress bar will be set as completed when it reaches its maxValue (default maxValue: 100);
	// ps: setInterval is used here just to simulate a task being done
	setInterval(function() {
		if(!progressBar.isCompleted()){
			progressBar.value += 1;
		}
	}, 20);
});