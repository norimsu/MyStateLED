var Gpio = require('onoff').Gpio;

var led = new Gpio(21, 'out');

var led_state = 0;

var iv = setInterval(function() {
    led_state = led.readSync();
    if (led_state == 0) led_state = 1;
    else led_state = 0;
    led.writeSync(led_state)
}, 200);

setTimeout(function() {
    clearInterval(iv);
    led.writeSync(0);
    led.unexport();
}, 5000);