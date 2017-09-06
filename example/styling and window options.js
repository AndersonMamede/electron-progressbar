const {app} = require('electron');
const ProgressBar = require('electron-progressbar');

app.on('ready', function() {
	var progressBar = new ProgressBar({
		text: 'Preparing data...',
		detail: 'Wait...',
		style: {
			text: {
				'font-weight': 'bold',
				'color': '#B11C11'
			},
			detail: {
				'color': '#3F51B5'
			},
			bar: {
				'background': '#FFD2CF'
			},
			value: {
				'background': '#F44336'
			}
		},
		browserWindow: {
			width: 1000
			icon: 'icon.ico' // path to the icon file
		}
	});
	
	setTimeout(function() {
		progressBar.complete();
	}, 4000);
});