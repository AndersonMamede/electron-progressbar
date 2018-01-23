const {app} = require('electron');
const ProgressBar = require('electron-progressbar');

app.on('ready', function() {
	var progressBar = new ProgressBar({
		text: 'Preparing data...',
		detail: 'Wait...',
		style: { // the keys are all elements of the progress bar
			text: { // pair of CSSS properties/values
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
			width: 1000,
			icon: 'icon.ico' // path to the icon file
		}
	});
	
	// launch a task...
	// launchTask();
	
	// when task is completed, set the progress bar to completed
	// ps: setTimeout is used here just to simulate an interval between the start and the end of a task
	setTimeout(function() {
		progressBar.setCompleted();
	}, 4000);
});