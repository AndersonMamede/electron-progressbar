const {app} = require('electron');
const ProgressBar = require('electron-progressbar');

const customHTML = `<!DOCTYPE html>
<html lang="en-us">
	<head>
		<meta charset="UTF-8">
		<style>
			* {
				margin: 0;
				padding: 0;
				box-sizing: border-box;
			}

			html,
			body {
				width: 100%;
				height: 100%;
			}

			body,
			table {
				word-break: break-word;
				word-wrap: break-word;
			}

			body {
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				margin: 0;
				padding: 0 50px;
				margin-bottom: 0;
			}

		/* (more styling...) */
		</style>
	</head>
	<body>
		<div id="text"></div>
		<div id="detail"></div>
		<div id="progressBarContainer"></div>

		<script>
			var currentValue = {
				progress: null,
				text: null,
				detail: null
			};

			var elements = {
				text: document.querySelector("#text"),
				detail: document.querySelector("#detail"),
				progressBarContainer: document.querySelector("#progressBarContainer"),
				progressBar: null // set by createProgressBar()
			};

			function createProgressBar(settings) {
				if (settings.indeterminate) {
					var progressBar = document.createElement("div");
					progressBar.setAttribute("id", "progressBar");
					progressBar.setAttribute("indeterminate", "t");

					var progressBarValue = document.createElement("div");
					progressBarValue.setAttribute("id", "progressBarValue");
					progressBar.appendChild(progressBarValue);

					elements.progressBar = progressBar;
					elements.progressBarContainer.appendChild(elements.progressBar);
				} else {
					var progressBar = document.createElement("progress");
					progressBar.setAttribute("id", "progressBar");
					progressBar.max = settings.maxValue;

					elements.progressBar = progressBar;
					elements.progressBarContainer.appendChild(elements.progressBar);
				}

				elements.text.innerHTML = currentValue.text;
				elements.detail.innerHTML = currentValue.detail;

				window.requestAnimationFrame(synchronizeUi);
			}

			function synchronizeUi() {
				elements.progressBar.value = currentValue.progress;
				window.requestAnimationFrame(synchronizeUi);
			}

			ipcRenderer.on("CREATE_PROGRESS_BAR", (event, settings) => {
				createProgressBar(settings);
			});

			ipcRenderer.on("SET_PROGRESS", (event, value) => {
				currentValue.progress = value;
			});

			ipcRenderer.on("SET_COMPLETED", (event) => {
				elements.progressBar.classList.add('completed');
			});

			ipcRenderer.on("SET_TEXT", (event, value) => {
				currentValue.text = value;
			});

			ipcRenderer.on("SET_DETAIL", (event, value) => {
				currentValue.detail = value;
			});
		</script>
	</body>
</html>
`;

app.on('ready', function() {
	var progressBar = new ProgressBar({
		customHTML: customHTML,
		/* other properties... */
	});
	
	progressBar
		.on('completed', function() {
			console.info(`completed...`);
			progressBar.detail = 'Task completed. Closing...';
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
