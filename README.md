![npm](https://img.shields.io/npm/dt/electron-progressbar.svg?style=flat-square)
![Hits](https://hitt.herokuapp.com/AndersonMamede/electron-progressbar.svg)

electron-progressbar
================
> electron-progressbar provides an easy-to-use and highly customizable API to show and control progress bars on Electron applications.

You can customize the aspects of the windows (electron's BrowserWindow), progress bars' visual aspects (CSS), texts and also all visible information.

[![NPM](https://nodei.co/npm/electron-progressbar.png?downloads=true&stars=true)](https://www.npmjs.com/package/electron-progressbar)

***
## Table of Contents

* [Installation](#installation)
* [Examples](#examples)
  * [Indeterminate progress bar](#indeterminate-progress-bar)
  * [Determinate progress bar](#determinate-progress-bar)
  * [More examples](#more-examples)
* [API](#api)
    * [`Methods`](#methods)
      * [`.new ProgressBar(options, [electronApp])`](#new-progressbaroptions-electronapp)
      * [`.getOptions()`](#getoptions--object) ⇒ <code>object</code>
      * [`.on(eventName, listener)`](#oneventname-listener--reference-to-this) ⇒ <code>reference to this</code>
        * [`Events`](#events)
          * [`ready`](#event-ready)
          * [`progress`](#event-progress)
          * [`completed`](#event-completed)
          * [`aborted`](#event-aborted)
      * [`.setCompleted()`](#setcompleted)
      * [`.close()`](#close)
      * [`.isInProgress()`](#isinprogress--boolean) ⇒ <code>boolean</code>
      * [`.isCompleted()`](#iscompleted--boolean) ⇒ <code>boolean</code>
    * [`Properties`](#properties)
      * [`value`](#value--number) ⇒ number
      * [`text`](#text--string) ⇒ string
      * [`detail`](#detail--string) ⇒ string
* [License](#license)

## Installation

Install with `npm`:

``` bash
$ npm install electron-progressbar --save
```

## Examples

### Indeterminate progress bar

Example of an **indeterminate** progress bar - used when your application can't calculate how long the task will last:

![Indeterminate progress bar](/examples/indeterminate-progress-bar.gif)

``` js
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
```

* * *

### Determinate progress bar

Example of a **determinate** progress bar - used when your application can accurately calculate how long the task will last:

![Determinate progress bar](/examples/determinate-progress-bar.gif)

``` js
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
```

<a name="more-examples"></a>More examples in [folder examples](/examples).

## API

### `Methods`

##### `new ProgressBar(options, [electronApp])`

Create a new progress bar. Because [electron's BrowserWindow](https://github.com/electron/electron/blob/master/docs/api/browser-window.md) is used to display the progress bar and it only works after [electron's "ready" event](https://github.com/electron/electron/blob/master/docs/api/app.md#event-ready), you have wait for the "ready" event before creating a progress bar; optionally, you can just pass electron's app as a second parameter (`electronApp`).

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [options] | <code>object</code> |  | electron-progressbar options |
| [options.abortOnError] | <code>boolean</code> | <code>false</code> | Whether progress bar should abort and close if an error occurs internally. |
| [options.indeterminate] | <code>boolean</code> | <code>true</code> | Whether progress bar should be **indeterminate**. If false, progress bar will be **determinate**. |
| [options.initialValue] | <code>number</code> | <code>0</code> | Progress bar's initial value. _Used only for determinate progress bar._ |
| [options.maxValue] | <code>number</code> | <code>100</code> | Progress bar's maximum value. When progress bar's value reaches this number, it will be set as completed and event `complete` will be fired. _Used only for determinate progress bar._ |
| [options.closeOnComplete] | <code>boolean</code> | <code>true</code> | Whether progress bar window should be automatically closed after completed. If false, the progress bar must be manually closed by calling its `close` method. |
| [options.title] | <code>string</code> | <code>'Wait...'</code> | Text shown on title bar. |
| [options.text] | <code>string</code> | <code>'Wait...'</code> | Text shown inside the window and above the progress bar. |
| [options.detail] | <code>string</code> | | Text shown between `text` and the progress bar element. Used to display the current status, i.e., what part of the whole task is being done. Usually setting this property later is more useful because your application can determine and display, in real time, what is currently happening. |
| [options.style] | <code>object</code> |  | Visual styles for elements: `text`, `detail`, `bar` and `value`. All elements' properties are purely CSS, just the way it is used in a `CSS file`. |
| [options.style.text] | <code>object</code> |  | An object containing any CSS properties for styling the `text` element. |
| [options.style.detail] | <code>object</code> |  | An object containing any CSS properties for styling the `detail` element. |
| [options.style.bar] | <code>object</code> | <code>{'width':'100%', 'background-color':'#BBE0F1'}</code> | An object containing any CSS properties for styling the `bar` in the progress bar. |
| [options.style.value] | <code>object</code> | <code>{'background-color':'#0976A9'}</code> | An object containing any CSS properties for styling the `value` in the progress bar. |
| [options.browserWindow] | <code>object</code> |  | [`Electron's BrowserWindow options`](https://github.com/electron/electron/blob/master/docs/api/browser-window.md#new-browserwindowoptions). Although only a few properties are used per default, you can specify any of [`Electron's BrowserWindow options`](https://github.com/electron/electron/blob/master/docs/api/browser-window.md#new-browserwindowoptions). |
| [options.browserWindow.parent] | <code>instance of BrowserWindow</code> | <code>null</code> | A [BrowserWindow instance](https://github.com/electron/electron/blob/master/docs/api/browser-window.md). If informed, the progress bar window will always show on top of the parent window and will block it so user can't interact with it until the progress bar is completed/aborted and closed. |
| [options.browserWindow.modal] | <code>boolean</code> | <code>true</code> | Whether this is a modal window. This actually only works if progress bar window is a child window, i.e., when its `parent` is informed. |
| [options.browserWindow.resizable] | <code>boolean</code> | <code>false</code> | Whether window is resizable. |
| [options.browserWindow.closable] | <code>boolean</code> | <code>false</code> | Whether window is closable. |
| [options.browserWindow.minimizable] | <code>boolean</code> | <code>false</code> | Whether window is minimizable. |
| [options.browserWindow.maximizable] | <code>boolean</code> | <code>false</code> | Whether window is maximizable. |
| [options.browserWindow.width] | <code>number</code> | <code>450</code> | Progress bar window's width in pixels. |
| [options.browserWindow.height] | <code>number</code> | <code>175</code> | Progress bar window's height in pixels. |

* * *

##### `getOptions()` ⇒ <code>object</code>

Return a copy of all current options.

* * *

##### `on(eventName, listener)` ⇒ <code>reference to this</code>

Adds the listener function to the end of the listeners array for the event named `eventName`. No checks are made to see if the `listener` has already been added. Multiple calls passing the same combination of `eventName` and `listener` will result in the `listener` being added, and called, multiple times.

Returns a reference to `this` so that calls can be chained.

### Events

| Event name | Receives parameter | Description |
| --- | --- | --- |
| <a name="event-ready"></a>ready | | Fired when progress bar is created and ready to be used and controlled. |
| <a name="event-progress"></a>progress | value | Available only for **determinate** progress bar. Fired every time the progress bar's value is changed. The listener receives, as first parameter, the current progress bar's value. |
| <a name="event-completed"></a>completed | value | Fired when progress bar is completed, i.e., its value reaches `maxValue` or method `complete` is called. The listener receives, as first parameter, the current progress bar's value. |
| <a name="event-aborted"></a>aborted | value | Fired if progress bar is closed when it's not completed yet, i.e., when user closes progress bar window or method `close` is called before progress bar is completed. The listener receives, as first parameter, the current progress bar's value. |

* * *

##### `setCompleted()`

Set progress bar as complete. This means the whole task is finished.

If progress bar is **indeterminate**, a manual call to this method is **required** because it's the only way to complete the task and trigger the `complete` event, otherwise the progress bar would be displayed forever.

* * *

##### `close()`

Close progress bar window. If progress bar is not completed yet, it'll be aborted and event `aborted` will be fired.

* * *

##### `isInProgress()` ⇒ <code>boolean</code>

Return true if progress bar is currently in progress, i.e., it hasn't been completed nor aborted yet, otherwise false.

* * *

##### `isCompleted()` ⇒ <code>boolean</code>

Return true if progress bar is completed, otherwise false.

* * *

### `Properties`

#### `value` ⇒ <code>number</code>

Get or set progress bar's `value`. Only available for **determinate** progress bar.

* * *

#### `text` ⇒ <code>string</code>

Get or set the `text`. This information is shown inside the window and above the progress bar.

* * *

#### `detail` ⇒ <code>string</code>

Get or set the `detail`. This information is shown between `text` and the progress bar element. Useful to display the current status in real time, i.e., what part of the whole task is being done, what is currently happening.

* * *

## License

MIT. See [LICENSE.md](http://github.com/AndersonMamede/electron-progressbar/blob/master/LICENSE) for details.
