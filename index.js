var Gpio = require('onoff').Gpio;
var firebase = require('firebase');

var led_working = new Gpio(16, 'out');
var led_inMind = new Gpio(21, 'out');
var led_absent = new Gpio(20, 'out');

var INSIGHT = new Object();

INSIGHT.config = {
    apiKey: "AIzaSyCau_rQmmK0Z3jQc-BxvcaIQJMbxvHm8mA",
    authDomain: "mystate-e3fc0.firebaseapp.com",
    databaseURL: "https://mystate-e3fc0.firebaseio.com",
    projectId: "mystate-e3fc0",
    storageBucket: "mystate-e3fc0.appspot.com",
    messagingSenderId: "76735108434"
};

INSIGHT.firebase = firebase;
INSIGHT.firebase.initializeApp(INSIGHT.config);
INSIGHT.controller = new Object();

INSIGHT.controller = {
    getAllInfo: function() {
        allInfo = INSIGHT.firebase.database().ref('/');
        return allInfo;
    },

    getUserInfo: function(id) {
        userInfo = INSIGHT.firebase.database().ref('/' + id);
        return userInfo;
    }
}

var led_state = 0;

var iv = setInterval(function() {
    led_state = led_absent.readSync();
    if (led_state == 0) led_state = 1;
    else led_state = 0;
    var userInfo = INSIGHT.controller.getUserInfo(1);
    userInfo.once("value")
        .then(function(snapshot) {
            console.log("개인 데이터");
            console.log(snapshot.val().name);
            console.log(snapshot.val().phone);
            console.log(snapshot.val().state);
            console.log(snapshot.val().team);
        });

    led_absent.writeSync(led_state);
    led_working.writeSync(led_state);
    led_inMind.writeSync(led_state);
}, 200);

setTimeout(function() {
    clearInterval(iv);
    led_absent.writeSync(0);
    led_absent.unexport();
    led_working.writeSync(0);
    led_working.unexport();
    led_inMind.writeSync(0);
    led_inMind.unexport();
}, 5000);
