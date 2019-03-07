'use strict';
const os = require('os');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const shell = require('shelljs');
const opn = require('opn');
const killer = require('cross-port-killer');
const httpserver = require('node-http-server');
const glob = require('glob');
const mkdirp = require('mkdirp');

exports.resolve = (filename, baseDir) => {
  baseDir = baseDir || process.cwd();
  if (filename) {
    return path.isAbsolute(filename) ? filename : path.resolve(baseDir, filename);
  }
  return baseDir;
};

exports.getIp = position => {
  const interfaces = os.networkInterfaces();
  const ips = [];

  if (interfaces.en0) {
    for (let i = 0; i < interfaces.en0.length; i++) {
      if (interfaces.en0[i].family === 'IPv4') {
        ips.push(interfaces.en0[i].address);
      }
    }
  }
  if (interfaces.en1) {
    for (let i = 0; i < interfaces.en1.length; i++) {
      if (interfaces.en1[i].family === 'IPv4') {
        ips.push(interfaces.en1[i].address);
      }
    }
  }
  if (position > 0 && position <= ips.length) {
    return ips[position - 1];
  } else if (ips.length) {
    return ips[0];
  }
  return '127.0.0.1';
};

exports.getHost = port => {
  const ip = exports.getIp();
  if (port) {
    return `http://${ip}:${port}`;
  }
  return `http://${ip}`;
};

exports.httpServer = (cfg, callback) => {
  const port = cfg.port || 8888;
  const root = exports.resolve(cfg.dist);
  let index = cfg.index;
  if (!index) {
    const files = glob.sync('*.html', { cwd: root, root });
    if (files.length > 0) {
      index = files[0];
    }
  }
  const options = {
    port,
    root,
    server: {
      index
    }
  };
  httpserver.deploy(options, server => {
    const url = `http://127.0.0.1:${server.config.port}`;
    const host = exports.getHost(server.config.port);
    console.log(chalk.green(`Http server ${chalk.yellow(url)} or ${chalk.yellow(host)} is serve ${chalk.blue(root)}\r\n`));
    callback && callback(server);
  });
};

exports.exec = cmd => {
  return shell.exec(cmd);
};

exports.rm = filepath => {
  const dirs = Array.isArray(filepath) ? filepath : [filepath];
  dirs.forEach(dir => {
    if (fs.existsSync(dir)) {
      /* istanbul ignore next */
      if (os.platform() === 'win32') {
        exports.deleteFile(dir);
        console.log(`remove [ ${dir} ] success`);
      } else {
        const result = shell.exec(`rm -rf ${dir}`);
        if (result.code === 0) {
          console.log(`remove [ ${dir} ] success`);
        } else {
          /* istanbul ignore next */
          exports.deleteFile(dir);
        }
      }
    }
  });
};

exports.deleteFile = filepath => {
  if (fs.existsSync(filepath)) {
    if (fs.statSync(filepath).isDirectory()) {
      const files = fs.readdirSync(filepath);
      files.forEach((file, index) => {
        const curPath = path.join(filepath, file);
        if (fs.statSync(curPath).isDirectory()) {
          exports.deleteFile(curPath);
        } else {
          fs.unlinkSync(curPath);
        }
      });
      fs.rmdirSync(filepath);
    } else {
      fs.unlinkSync(filepath);
    }
  }
};

/* istanbul ignore next */
exports.open = filepath => {
  const folder = path.isAbsolute(filepath) ? filepath : path.resolve(process.cwd(), filepath);
  switch (os.platform()) {
    case 'win32':
      shell.exec(`explorer ${folder}`);
      break;
    case 'darwin':
      shell.exec(`open ${folder} -a finder`);
      break;
    case 'linux':
      shell.exec(`nautilus ${folder}`);
      break;
    default:
      opn(folder);
      break;
  }
};

exports.openBrowser = (port, url) => {
  if (!url) {
    url = exports.getHost(port);
  }
  opn(url);
};

exports.checkPortUsed = port => {
  let cmd = '';
  switch (os.platform()) {
    case 'win32':
      cmd = `netstat -ano | findstr ${port}`;
      break;
    case 'darwin':
      cmd = `netstat -anp tcp | grep ${port}`;
      break;
    case 'linux':
      cmd = `netstat -apn | grep  ${port}`;
      break;
    default:
      cmd = `netstat -apn | grep  ${port}`;
      break;
  }
  try {
    const result = shell.exec(cmd, { silent: true });
    return !!result.stdout;
  } catch (err) {
    return false;
  }
};

exports.getPort = (port, count = 10) => {
  let newPort = port;
  let checkPort = port;
  while (checkPort < port + count) {
    const isUsed = exports.checkPortUsed(checkPort);
    if (!isUsed) {
      newPort = checkPort;
      break;
    }
    checkPort++;
  }
  return newPort;
};

/* istanbul ignore next */
exports.kill = function(port) {
  if (port) {
    const ports = Array.isArray(port) ? port : String(port).split(',');
    ports.forEach(p => {
      killer.kill(p).then(() => {
        console.log(`kill port ${p} success`);
      }).catch(() => {
        console.log(`kill port ${p} failed`);
      });
    });
  }
};

exports.writeFile = (filepath, content) => {
  try {
    mkdirp.sync(path.dirname(filepath));
    fs.writeFileSync(filepath, typeof content === 'string' ? content : JSON.stringify(content, null, 2), 'utf8');
  } catch (e) {
    console.error(`writeFile ${filepath} err`, e);
  }
};

exports.readFile = filepath => {
  try {
    if (fs.existsSync(filepath)) {
      const content = fs.readFileSync(filepath, 'utf8');
      return JSON.parse(content);
    }
  } catch (e) {
    /* istanbul ignore next */
  }
  return undefined;
};