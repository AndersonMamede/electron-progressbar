[![NPM downloads][npm-downloads]][npm-url]
[![NPM total downloads][npm-total-downloads]][npm-url]

| &nbsp;<br>[![Donate][donate-badge]][donate-url] <br>&nbsp; | Your help is appreciated! [Create a PR][create-pr] or just [buy me a coffee][donate-url] |
|-|-|

[npm-url]: https://www.npmjs.com/package/electron-progressbar
[npm-downloads]: https://img.shields.io/npm/dm/electron-progressbar.svg
[npm-total-downloads]: https://img.shields.io/npm/dt/electron-progressbar.svg?label=total+downloads
[donate-badge]: https://img.shields.io/badge/Buy%20me%20a%20coffee-Donate-red.svg
[donate-url]: https://github.com/sponsors/AndersonMamede
[create-pr]: https://github.com/AndersonMamede/electron-progressbar/pulls

electron-progressbar
================
> electron-progressbar provides an easy-to-use and highly customizable API, to show and manipulate progress bars on Electron applications.

With electron-progressbar, you can easily customize the appearance of the progress bars, including the visual aspects using CSS, as well as the text and any other visible information. Additionally, the library allows for customization of the Electron BrowserWindow that contains the progress bars.

[![NPM](https://nodei.co/npm/electron-progressbar.png?downloads=true&stars=true)](https://www.npmjs.com/package/electron-progressbar)

## Demo

[Indeterminate progress bar:](#indeterminate-progress-bar)<br>
![Indeterminate progress bar](/examples/indeterminate-progress-bar.gif)

[Determinate progress bar:](#determinate-progress-bar)<br>
![Determinate progress bar](/examples/determinate-progress-bar.gif)
<br>
<br>
In addition to displaying progress bars within the window, electron-progressbar also enables progress bars to be displayed in the taskbar using the [BrowserWindow's setProgressBar method](https://github.com/electron/electron/blob/master/docs/tutorial/progress-bar.md#progress-bar-in-taskbar-windows-macos-unity). This feature allows the user to view progress information without needing to switch to the window itself.

example of the taskbar for an **indeterminate progress bar**:<br>
![Taskbar for indeterminate progress bar](/examples/taskbar-indeterminate-progress-bar.gif)

example of the taskbar for a **determinate progress bar**:<br>
![Taskbar for determinate progress bar](/examples/taskbar-determinate-progress-bar.gif)

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
* [Changelog](#changelog)
* [License](#license)

## Installation

Install with `npm`:

``` bash
$ npm i electron-progressbar
```

## Examples

### Indeterminate progress bar

Example of an **indeterminate** progress bar - this progress bar is useful when your application cannot calculate how long the task will take to complete:

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
  // ps: setTimeout is used here just to simulate an interval between
  // the start and the end of a task
  setTimeout(function() {
    progressBar.setCompleted();
  }, 3000);
});
```

* * *

### Determinate progress bar

Example of a **determinate** progress bar - this progress bar is useful when your application can accurately calculate how long the task will take to complete:

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
  
  // launch a task and increase the value of the progress bar for each step completed of a big task;
  // the progress bar is set to completed when it reaches its maxValue (default maxValue: 100);
  // ps: setInterval is used here just to simulate the progress of a task
  setInterval(function() {
    if(!progressBar.isCompleted()){
      progressBar.value += 1;
    }
  }, 20);
});
```

<a name="more-examples"></a>More examples are available in [folder examples](/examples).

## API

### `Methods`

##### `new ProgressBar(options, [electronApp])`

Create a new progress bar. It's necessary to wait for the [`ready` event](https://github.com/electron/electron/blob/master/docs/api/app.md#event-ready) to be emitted by [Electron's BrowserWindow](https://github.com/electron/electron/blob/master/docs/api/browser-window.md), since the progress bar is displayed within it. Optionally, you can pass the electron app as a second parameter (parameter `electronApp`) when creating the progress bar. Check the sample code on this page for detailed examples on how to set properties to `options`.

You can define most of the characteristics of the progress bar using the `options` parameter. Below is a list of properties that you can set for the `options` parameter.

| Option name | Type | Default value | Description |
| --- | --- | --- | --- |
| abortOnError | <code>boolean</code> | <code>false</code> | Specifies whether the progress bar should automatically abort and close if an error occurs internally. |
| indeterminate | <code>boolean</code> | <code>true</code> | Specifies whether the progress bar should be **indeterminate**. If set to false, the progress bar will be **determinate**. |
| initialValue | <code>number</code> | <code>0</code> | The initial value for the progress bar. _This parameter is only applicable for **determinate** progress bars._ |
| maxValue | <code>number</code> | <code>100</code> | The maximum value for the progress bar. When the progress bar's value reaches this number, the progress bar will be considered complete and the `complete` event will be fired. _This parameter is only applicable for **determinate** progress bars._ |
| closeOnComplete | <code>boolean</code> | <code>true</code> | Specifies whether the progress bar window should be automatically closed after the progress bar completes. If set to `false`, the progress bar will remain visible until the `close` method is called by your application. |
| title | <code>string</code> | <code>'Wait...'</code> | Specifies the text shown on the progress bar window's title bar. |
| text | <code>string</code> | <code>'Wait...'</code> | Specifies the text shown inside the progress bar window, next to the progress bar. |
| detail | <code>string</code> | | Specifies the text shown between `text` and the progress bar element. It can be used to display detailed information, such as the current progress of a task. When used for this purpose, it is usually more useful to set this property later so that your application can calculate and display, in real time, the current progress of the task. |
| style | <code>object</code> |  | Specifices the visual styles for the `text`, `detail`, `bar`, and `value` elements. All properties and values are pure CSS format, in the exact same way they would be used in a `CSS file`. Check the options for `style` below. |
| style.text | <code>object</code> | "Wait..." | An object containing CSS properties for styling the `text` element. |
| style.detail | <code>object</code> | "Wait..." | An object containing CSS properties for styling the `detail` element. |
| style.bar | <code>object</code> | <code>{'width':'100%', 'background-color':'#BBE0F1'}</code> | An object containing CSS properties for styling the `bar` element of the progress bar. |
| style.value | <code>object</code> | <code>{'background-color':'#0976A9'}</code> | An object containing CSS properties for styling the `value` element in the progress bar. |
| remoteWindow | <code>instance of BrowserWindow</code> | <code>null</code> | Specifies the BrowserWindow where the progress bar will be displayed. If null/undefined/empty or not specified, a new BrowserWindow will be created to show the progress bar. |
| browserWindow | <code>object</code> |  | Specifies the options for [`Electron's BrowserWindow`](https://github.com/electron/electron/blob/master/docs/api/browser-window.md#new-browserwindowoptions). Check the options for `browserWindow` below. P.S.: although only a few options are set by default, you can specify any of [Electron's BrowserWindow options](https://github.com/electron/electron/blob/main/docs/api/browser-window.md#new-browserwindowoptions).
| browserWindow.parent | <code>instance of BrowserWindow</code> | <code>null</code> | A [BrowserWindow instance](https://github.com/electron/electron/blob/master/docs/api/browser-window.md) to be used as the parent of the progress bar's window. If specified, the progress bar window will always be on top of the given parent window and will block user interaction in parent window until the progress bar is completed (or aborted) and closed. |
| [options.browserWindow.modal] | <code>boolean</code> | <code>true</code> | Specifies whether the progress bar's window is a modal window. Note that this property only works when the progress bar's window is a child window, i.e., when `browserWindow.parent` is specified. |
| browserWindow.resizable | <code>boolean</code> | <code>false</code> | Specifies whether the user can resize the progress bar's window. |
| browserWindow.closable | <code>boolean</code> | <code>false</code> | Specifies whether the user can close the progress bar's window. |
| browserWindow.minimizable | <code>boolean</code> | <code>false</code> | Specifies whether the user can minimize the progress bar's window. |
| browserWindow.maximizable | <code>boolean</code> | <code>false</code> | Specifies whether the user can maximize the progress bar's window. |
| browserWindow.width | <code>number</code> | <code>450</code> | Specifies the width of the progress bar's window in pixels. Only numeric values are accepted, for example: 600. |
| browserWindow.height | <code>number</code> | <code>175</code> | Specifies the height of the progress bar's window in pixels. Only numeric values are accepted, for example: 600. |
| browserWindow<br>.webPreferences.nodeIntegration | <code>boolean</code> | <code>true</code> | Specifies whether node integration is enabled. |
| browserWindow<br>.webPreferences.contextIsolation | <code>boolean</code> | <code>false</code> | Specifies whether contextIsolation is enabled. |

* * *

##### `getOptions()` ⇒ <code>object</code>

Return a copy of all current options.

* * *

##### `on(eventName, listener)` ⇒ <code>reference to this</code>

Adds the listener function to the end of the listeners array for the event named `eventName`. No checks are made to see if the `listener` has already been added. Multiple calls passing the same combination of `eventName` and `listener` will result in the `listener` being added and called multiple times.

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

Get or set the `detail`. This information is shown between `text` and the progress bar element. Useful to display any detailed information, e.g., the current status in real time or the current step of the task.

* * *

## Changelog

[Changelog](/CHANGELOG.md)

## License

MIT. See [LICENSE.md](http://github.com/AndersonMamede/electron-progressbar/blob/master/LICENSE) for details.
