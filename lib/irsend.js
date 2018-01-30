var exec = require('child_process').exec;

exports = module.exports = IRSend;

function IRSend() {
  this.command = 'irsend';
};

// In some cases the default lirc socket does not work
// More info at http://wiki.openelec.tv/index.php?title=Guide_to_Lirc_IR_Blasting
IRSend.prototype.setSocket = function(socket) {
  if (socket) {
    this.command = 'irsend -d ' + socket;
  } else {
    this.command = 'irsend';
  }
};

/*
 *************************
 */

const cmds = [];
let running = false;

const execute = function() {
  running = true;
  const next = cmds.shift();
  console.log(next);
  exec(next, function() {
    if (cmds.length > 0) {
      execute();
    } else {
      running = false;
    }
  });
}

IRSend.prototype.send = function(remote, code) {
  var command = "dir"; //this._send_once(remote, code);
  cmds.push(command);
  if (!running) {
    console.log('start runner');
    execute();
  }
};

/*
 *************************
 */

IRSend.prototype.list = function(remote, code, callback) {
  var command = this._list(remote, code);
  return exec(command, callback);
};

IRSend.prototype.send_once = function(remote, code, callback) {
  var command = this._send_once(remote, code);
  return exec(command, callback);
};

IRSend.prototype.send_start = function(remote, code, callback) {
  var command = this._send_start(remote, code);
  return exec(command, callback);
};

IRSend.prototype.send_stop = function(remote, code, callback) {
  var command = this._send_stop(remote, code);
  return exec(command, callback);
};

IRSend.prototype.set_transmitters = function(transmitters, callback) {
  var command = this._set_transmitters(transmitters);
  return exec(command, callback);
};

IRSend.prototype.simulate = function(code, callback) {
  var command = this._simulate(code);
  return exec(command, callback);
};

// Internal methods
IRSend.prototype._list = function(remote, code) {
  if (!remote) remote = '';
  if (!code) code = '';

  return this.command + ' LIST "' + remote + '" "' + code + '"';
};

IRSend.prototype._send_once = function(remote, code) {
  if (!remote) remote = '';
  if (!code) code = '';

  if (code instanceof Array) {
    var newCode = '';

    code.forEach(function(element, index, array) {
      newCode = newCode + '"' + element + '" ';
    });

    code = newCode.trim();
    code = code.substr(1, code.length - 2);
  }

  return this.command + ' SEND_ONCE "' + remote + '" "' + code + '"';
};

IRSend.prototype._send_start = function(remote, code) {
  if (!remote) remote = '';
  if (!code) code = '';

  return this.command + ' SEND_START "' + remote + '" "' + code + '"';
};

IRSend.prototype._send_stop = function(remote, code) {
  if (!remote) remote = '';
  if (!code) code = '';

  return this.command + ' SEND_STOP "' + remote + '" "' + code + '"';
};

IRSend.prototype._set_transmitters = function(transmitters) {
  if (transmitters instanceof Array) {
    var newTransmitters = '';

    transmitters.forEach(function(element, index, array) {
      newTransmitters = newTransmitters + element + " ";
    });

    transmitters = newTransmitters.trim();
  }

  return this.command + ' SET_TRANSMITTERS ' + transmitters;
};

IRSend.prototype._simulate = function(code) {
  return this.command + ' SIMULATE "' + code + '"';
};
