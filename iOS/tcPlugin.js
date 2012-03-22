(function() {
    var delegate = {}
    var TwilioPlugin = {
        Device: function() {
            return this;
        },

        Connection: function() {
            return this;
        }
    }

    TwilioPlugin.Device.prototype.setup = function(token) {
        // Take a token and instantiate a new device object
        var error = function(callback) {
            // TODO: implement this
        }

        var success = function(callback) {
            var argument = callback['arguments'] || new Twilio.Connection();
            if (delegate[callback['callback']]) delegate[callback['callback']](argument);
        }

        Cordova.exec(success, error, "TCPlugin", "deviceSetup", [token]);
    }

    // polymorphic function. if called with function as an argument, the function is invoked
    // when a connection has been established. if called with an object a connection is established with those options
    TwilioPlugin.Device.prototype.connect = function(argument) {
        if (typeof(argument) == 'function') {
            delegate['onconnect'] = argument;
        } else if (typeof(argument) == 'object') {
            Cordova.exec("TCPlugin.connect", argument)
        }
    }

    TwilioPlugin.Device.prototype.disconnectAll = function() {
        Cordova.exec('TCPlugin.disconnectAll');
    }

    TwilioPlugin.Device.prototype.disconnect = function(fn) {
        delegate['ondevicedisconnect'] = fn;
    }

    TwilioPlugin.Device.prototype.ready = function(fn) {
        delegate['onready'] = fn;
    }

    TwilioPlugin.Device.prototype.offline = function(fn) {
        delegate['onoffline'] = fn;
    }

    TwilioPlugin.Device.prototype.incoming = function(fn) {
        delegate['onincoming'] = fn;
    }

    TwilioPlugin.Device.prototype.cancel = function(fn) {
        delegate['oncancel'] = fn;
    }

    TwilioPlugin.Device.prototype.error = function(fn) {
        delegate['onerror'] = fn;
    }

    TwilioPlugin.Device.prototype.presence = function(fn) {
        delegate['onpresence'] = fn;
    }

    TwilioPlugin.Device.prototype.status = function() {
        var status = Cordova.exec("TCPlugin.deviceStatus");
    }

    // Noops until I figure out why the hell using sounds in Phonegap gives EXC_BAD_ACCESS
    TwilioPlugin.Device.prototype.sounds = {
        incoming: function(boolean) {},
        outgoing: function(boolean) {},
        disconnect: function(boolean) {}
    }

    TwilioPlugin.Connection.prototype.accept = function(argument) {
        if (typeof(argument) == 'function') {
            delegate['onaccept'] = argument;
        } else {
            Cordova.exec("TCPlugin.acceptConnection");
        }
    }

    TwilioPlugin.Connection.prototype.reject = function() {
        Cordova.exec("TCPlugin.rejectConnection");
    }

    TwilioPlugin.Connection.prototype.disconnect = function(fn) {
        if (typeof(argument) == 'function') {
            delegate['onconnectiondisconnect'] = argument;
        } else {
            Cordova.exec("TCPlugin.disconnectConnection");
        }
    }

    TwilioPlugin.Connection.prototype.error = function(fn) {
        delegate['onconnectionerror'] = fn;
    }

    TwilioPlugin.Connection.prototype.mute = function() {
        Cordova.exec("TCPlugin.muteConnection");
    }

    TwilioPlugin.Connection.prototype.unmute = function() {
        Cordova.exec("TCPlugin.muteConnection");
    }

    TwilioPlugin.Connection.prototype.sendDigits = function(string) {
        Cordova.exec("TCPlugin.sendDigits", string);
    }

    TwilioPlugin.Connection.prototype.status = function() {
        return Cordova.exec("TCPlugin.deviceStatus");
    }

    TwilioPlugin.install = function() {
        if (!window.Twilio) window.Twilio = {};
        if (!window.Twilio.Device) window.Twilio.Device = new TwilioPlugin.Device();
        if (!window.Twilio.Connection) window.Twilio.Connection = TwilioPlugin.Connection;
    }

    Cordova.addConstructor(TwilioPlugin.install);

})()