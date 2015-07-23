(function(window, _, React, NOR, undefined) {

  var STATUS_ERROR_CLASS = 'status--error';
  var STATUS_POSITIVE_CLASS = 'status--positive';
  var UI_ELEMENT_IDS = [ 'server-address', 'server-port', 'participant-id', 'connect' ];

  // private

  var _nor;

  var _bandpass, _compressor, _inputA, _inputB, _reverb, _random;

  function _setStatus(sMessage, sClass) {

    var elem;
    elem = document.getElementById('status');

    _.removeClass(elem, STATUS_ERROR_CLASS);
    _.removeClass(elem, STATUS_POSITIVE_CLASS);

    if (sClass) {
      _.addClass(elem, sClass);
    }

    elem.innerText = sMessage;

  }

  function _setUIAvailability(sStatus) {
    UI_ELEMENT_IDS.forEach(function(eItem) {
      document.getElementById(eItem).disabled = ! sStatus;
    });
  }

  // public

  var app = {};

  app.init = function() {

    var firstViewId;

    _nor = new NOR();

    _nor.onStatusChange(function(nStatus) {

      var message, type;

      switch(nStatus) {

        case NOR.SERVER_ERROR:
          type = STATUS_ERROR_CLASS;
          message = 'ERROR';
          _setUIAvailability(true);
          break;

        case NOR.SERVER_DISCONNECTED:
          type = STATUS_ERROR_CLASS;
          message = 'OFFLINE';
          _setUIAvailability(true);
          break;

        case NOR.SERVER_CONNECTED:
          type = STATUS_POSITIVE_CLASS;
          message = 'ONLINE';
          _setUIAvailability(false);
          break;

        default:
          message = 'CONNECTING';

      }

      _setStatus(message, type);

    });

    // react setup

    React.initializeTouchEvents(true);

    // components

    _bandpass = React.render(React.createElement(NOR.Component.Slider, {
      min: 50,
      max: 100,
      steps: 10,
      onValueChanged: function(cFromValue, cToValue) {
        _nor.setBandpass(cFromValue, cToValue);
      }
    }), document.getElementById('slider-bandpass'));

    _inputA = React.render(React.createElement(NOR.Component.Toggle, {
      initialValue: true,
      label: 'IN A',
      backgroundColor: NOR.BLUE,
      onValueChanged: function(cStatus) {
        _nor.setInput(0, cStatus);
      }
    }), document.getElementById('toggle-input-a'));

    _inputB = React.render(React.createElement(NOR.Component.Toggle, {
      label: 'IN B',
      backgroundColor: NOR.BLUE,
      onValueChanged: function(cStatus) {
        _nor.setInput(1, cStatus);
      }
    }), document.getElementById('toggle-input-b'));

    _compressor = React.render(React.createElement(NOR.Component.Toggle, {
      label: 'COMP',
      backgroundColor: NOR.YELLOW,
      onValueChanged: _nor.setCompressor,
    }), document.getElementById('toggle-compressor'));

    _reverb = React.render(React.createElement(NOR.Component.Toggle, {
      label: 'RVB',
      backgroundColor: NOR.YELLOW,
      onValueChanged: _nor.setReverb,
    }), document.getElementById('toggle-reverb'));

    _random = React.render(React.createElement(NOR.Component.Toggle, {
      label: 'CHAOS',
      backgroundColor: NOR.RED,
      onValueChanged: _nor.setRandom,
    }), document.getElementById('toggle-random'));

    // initial status

    _setStatus('STANDBY');

    // connect button

    document.getElementById('connect').addEventListener('click', function() {

      var address, port, id;

      address = document.getElementById('server-address').value;
      port = parseInt(document.getElementById('server-port').value, 10)
      id = parseInt(document.getElementById('participant-id').value, 10)

      _nor.connect(id, address, port);

      _setUIAvailability(false);

    });

  };

  window.app = window.app || app;

})(window, window._, window.React, window.NOR);