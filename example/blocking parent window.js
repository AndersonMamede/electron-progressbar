const {app, BrowserWindow} = require('electron');
const ProgressBar = require('electron-progressbar');

app.on('ready', function() {
	var mainWindow = new BrowserWindow({
		width: 1000,
		height: 500
	});
	
	var progressBar = new ProgressBar({
		indeterminate: false,
		text: 'Preparing data...',
		browserWindow: {
			parent: mainWindow
		}
	});
	
	progressBar
		.on('progress', function(value) {
			progressBar.detail = `Value ${value} of ${progressBar.getOptions().maxValue}...`;
		})
		.on('completed', function(value) {
			clearInterval(interval);
			
			setTimeout(function() {
				progressBar.close();
			}, 1500);
		});
	
	var interval = setInterval(function() {
		progressBar.value += 1;
	}, 20);
});