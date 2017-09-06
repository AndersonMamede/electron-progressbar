const {app} = require('electron');
const ProgressBar = require('electron-progressbar');

app.on('ready', function() {
	var progressBar = new ProgressBar({
		text: 'Preparing data...',
		detail: 'Wait...'
	});
	
	progressBar
		.on('completed', function(value) {
			console.info(`completed... ${value}`);
		})
		.on('aborted', function(value) {
			console.info(`aborted... ${value}`);
		});
	
	setTimeout(function() {
		progressBar.complete();
	}, 3000);
});