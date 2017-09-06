const {app} = require('electron');
const ProgressBar = require('electron-progressbar');

app.on('ready', function() {
	var progressBar = new ProgressBar({
		closeOnComplete: false,
		indeterminate: false,
		text: 'Preparing data...'
	});
	
	progressBar
		.on('progress', function(value) {
			progressBar.detail = `Value ${value} of ${progressBar.getOptions().maxValue}...`;
		})
		.on('completed', function(value) {
			clearInterval(interval);
			progressBar.detail = 'Completed. Exiting...';
			
			setTimeout(function() {
				progressBar.close();
			}, 1500);
		})
		.on('aborted', function(value) {
			console.info(`aborted... ${value}`);
		});
	
	var interval = setInterval(function() {
		progressBar.value += 1;
	}, 20);
});