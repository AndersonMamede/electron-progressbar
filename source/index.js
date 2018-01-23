'use strict';

const BrowserWindow = require('electron').BrowserWindow;

// use 'extend' because 'Object.assign' doesn't work for deep copy
const extend = require('extend');

class ProgressBar {
	constructor(options, electronApp) {
		this._defaultOptions = {
			abortOnError: false,
			debug: false,
			
			indeterminate: true,
			initialValue: 0,
			maxValue: 100,
			closeOnComplete: true,
			title: 'Wait...',
			text: 'Wait...',
			detail: null,
			
			style: {
				text: {},
				detail: {},
				bar: {
					'width': '100%',
					'background': '#BBE0F1'
				},
				value: {
					'background': '#0976A9'
				}
			},
			
			browserWindow: {
				parent: null,
				modal: true,
				resizable: false,
				closable: false,
				minimizable: false,
				maximizable: false,
				width: 500,
				height: 170
			}
		};
		
		this._styleSelector = {
			determinate: {
				text: '#text',
				detail: '#detail',
				bar: '#progressBar::-webkit-progress-bar',
				value: '#progressBar::-webkit-progress-value'
			},
			indeterminate: {
				text: '#text',
				detail: '#detail',
				bar: '#progressBar[indeterminate="t"]',
				value: '#progressBar[indeterminate="t"] #progressBarValue'
			}
		};
		
		this._callbacks = {
			'ready': [], // list of function(){}
			'progress': [], // list of function(value){}
			'completed': [], // list of function(value){}
			'aborted': [] // list of function(value){}
		};
		
		this._inProgress = true;
		this._options = this._parseOptions(options);
		this._realValue = this._options.initialValue;
		this._window = null;
		
		if (electronApp) {
			if (electronApp.isReady()) {
				this._createWindow();
			} else {
				electronApp.on('ready', () => this._createWindow.call(this));
			}
		} else {
			this._createWindow();
		}
	}
	
	get value() {
		return this._options.indeterminate ? null : this._realValue;
	}
	
	get text() {
		return this._options.text;
	}
	
	get detail() {
		return this._options.detail;
	}
	
	set title(title) {
		if (this._window) {
			this._window.setTitle(title);
		}
	}
	
	set value(value) {
		if (!this._window) {
			return this._error('Invalid call: trying to set value but the progress bar window is not active.');
		}
		
		if (!this.isInProgress()) {
			return this._error('Invalid call: trying to set value but the progress bar is already completed.');
		}
		
		if (this._options.indeterminate) {
			return this._error('Invalid call: setting value on an indeterminate progress bar is not allowed.');
		}
		
		if (typeof value != 'number') {
			return this._error(`Invalid call: 'value' must be of type 'number' (type found: '` + (typeof value) + `').`);
		}
		
		this._realValue = Math.max(this._options.initialValue, value);
		this._realValue = Math.min(this._options.maxValue, this._realValue);
		
		this._window.webContents.send('SET_PROGRESS', this._realValue);
		
		this._fire('progress', [this._realValue]);
		
		this._execWhenCompleted();
	}
	
	set text(text) {
		this._options.text = text;
		this._window.webContents.send('SET_TEXT', text);
	}
	
	set detail(detail) {
		this._options.detail = detail;
		this._window.webContents.send('SET_DETAIL', detail);
	}
	
	getOptions() {
		return extend({}, this._options);
	}
	
	on(event, callback) {
		this._callbacks[event].push(callback);
		return this;
	}
	
	setCompleted() {
		if (!this.isInProgress()) {
			return;
		}
		
		this._realValue = this._options.maxValue;
		
		if (!this._options.indeterminate) {
			this._window.webContents.send('SET_PROGRESS', this._realValue);
		}
		
		this._execWhenCompleted();
	}
	
	close() {
		if (!this._window || this._window.isDestroyed()) {
			return;
		}
		
		this._window.destroy();
	}
	
	isInProgress() {
		return this._inProgress;
	}
	
	isCompleted() {
		return this._realValue >= this._options.maxValue;
	}
	
	_error(message) {
		if (this._options.abortOnError) {
			if (this._window && !this._window.isDestroyed()) {
				this._window && this._window.destroy();
			}
			
			throw Error(message);
		} else {
			console.warn(message);
		}
	}
	
	_fire(event, params) {
		this._callbacks[event] && this._callbacks[event].forEach(cb => {
			cb.apply(cb, params || []);
		});
	}
	
	_parseOptions(originalOptions) {
		let options = extend(true, {}, this._defaultOptions, originalOptions);
		
		if (options.indeterminate) {
			options.initialValue = 0;
			options.maxValue = 100;
		}
		
		if (options.title && !options.browserWindow.title) {
			options.browserWindow.title = options.title;
		}
		
		return options;
	}
	
	_parseStyle() {
		let style = [];
		let styleSelector = this._styleSelector[this._options.indeterminate ? 'indeterminate' : 'determinate'];
		
		Object.keys(styleSelector).forEach(el => {
			if (!styleSelector[el]) {
				return;
			}
			
			style.push(`${styleSelector[el]}{`);
			for (let prop in this._options.style[el]) {
				style.push(`${prop}:${this._options.style[el][prop]} !important;`);
			}
			style.push(`}`);
		});
		
		if (this._options.indeterminate) {
			if (this._options.style && this._options.style.value && this._options.style.value.background) {
				style.push(`
					.completed${this._styleSelector.indeterminate.bar},
					.completed${this._styleSelector.indeterminate.value}{
						background: ${this._options.style.value.background} !important;
					}
				`);
			}
		}
		
		return style.join('');
	}
	
	_createWindow() {
		this._window = new BrowserWindow(this._options.browserWindow);
		
		this._window.setMenu(null);
		
		if(this._options.debug){
			this._window.webContents.openDevTools({mode: 'detach'});
		}
		
		this._window.on('closed', () => {
			this._inProgress = false;
			this._window = null;
			
			if (this._realValue < this._options.maxValue) {
				this._fire('aborted', [this._realValue]);
			}
		});
		
		this._window.loadURL(`file://${__dirname}/index.html`);
		
		this._window.webContents.on('did-finish-load', () => {
			if (this._options.text !== null) {
				this.text = this._options.text;
			}
			
			if (this._options.detail !== null) {
				this.detail = this._options.detail;
			}
			
			this._window.webContents.insertCSS(this._parseStyle());
			
			if (this._options.maxValue !== null) {
				this._window.webContents.send('CREATE_PROGRESS_BAR', {
					indeterminate: this._options.indeterminate,
					maxValue: this._options.maxValue
				});
			}
			
			this._fire('ready');
		});
	}
	
	_execWhenCompleted() {
		if (!this.isInProgress() || !this.isCompleted() || !this._window || !this._window.webContents) {
			return;
		}
		
		this._inProgress = false;
		
		this._window.webContents.send('SET_COMPLETED');
		
		this._fire('completed', [this._realValue]);
		
		if (this._options.closeOnComplete) {
			var delayToFinishAnimation = 500;
			setTimeout(() => this.close(), delayToFinishAnimation);
		}
	}
}

module.exports = ProgressBar;