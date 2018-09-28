# node-tool-utils

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][codecov-image]][codecov-url]
[![David deps][david-image]][david-url]
[![Known Vulnerabilities][snyk-image]][snyk-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/node-tool-utils.svg?style=flat-square
[npm-url]: https://npmjs.org/package/node-tool-utils
[travis-image]: https://img.shields.io/travis/hubcarl/node-tool-utils.svg?style=flat-square
[travis-url]: https://travis-ci.org/hubcarl/node-tool-utils
[codecov-image]: https://img.shields.io/codecov/c/github/hubcarl/node-tool-utils.svg?style=flat-square
[codecov-url]: https://codecov.io/github/hubcarl/node-tool-utils?branch=master
[david-image]: https://img.shields.io/david/hubcarl/node-tool-utils.svg?style=flat-square
[david-url]: https://david-dm.org/hubcarl/node-tool-utils
[snyk-image]: https://snyk.io/test/npm/node-tool-utils/badge.svg?style=flat-square
[snyk-url]: https://snyk.io/test/npm/node-tool-utils
[download-image]: https://img.shields.io/npm/dm/node-tool-utils.svg?style=flat-square
[download-url]: https://npmjs.org/package/node-tool-utils

Node Cross-Platform Tool Library

## Featues

```bash
npm install node-tool-utils --save
```

## Usage

```js
const tool = require('node-tool-utils');
```

### Get Local IP Address

```js
const ip = tool.getIP();
```

### Get Local Host 

```js
const host = tool.getHost(7001);
// http://100.10.196.1:7001
```

### Kill the occupied port

```js
tool.kill(7001);
tool.kill([7001,7002]);
```

### Check port is available

```js
// return true or false
const isUsed = tool.checkPortUsed(7001);
```

### Get an available port

When 7001 is occupied, it will automatically detect whether 7002 is occupied. If it is not occupied, it will return. Otherwise, it will continue to increment detection. The default check is 10 times.

```js
const port = tool.getPort(7001);
```

### Delete File

```js
const dir = path.join(__dirname, 'dist/index.html');
tool.deleteFile(dir);
```

### Delete Dir

```js
const dir = path.join(__dirname, 'dist');
tool.rm(dir);
```

### Open Browser Or Window

Open the Window or Finder or Browser of the specified path

```js
tool.open('.'); // open Window or Finder
tool.openBrowser(); // open Browser
```

### Start Web Http Server

Default check HTML file as homepage

```js
const dist = path.join(__dirname, 'dist');
tool.httpserver({ port: 8088, dist },() => {});
```

## License

[MIT](LICENSE)
