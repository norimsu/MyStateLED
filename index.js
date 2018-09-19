var Gpio = require('onoff').Gpio;
var firebase = require('firebase');

var led_working = new Gpio(20, 'out');
var led_inMind = new Gpio(21, 'out');
var led_absent = new Gpio(16, 'out');

var INSIGHT = {};

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
INSIGHT.controller = {};

INSIGHT.controller = {
    getAllInfo: function() {
        allInfo = INSIGHT.firebase.database().ref('/');
        return allInfo;
    },

    getUserInfo: function(id) {
        userInfo = INSIGHT.firebase.database().ref('/' + id);
        return userInfo;
    }
};

var led_absent_state = 0;
var led_working_state = 0;
var led_inMind_state = 0;

var user_state = "";

var iv = setInterval(function() {
    // led 상태 동기화
    led_absent_state = led_absent.readSync();
    led_working_state = led_working.readSync();
    led_inMind_state = led_inMind.readSync();

    var userInfo = INSIGHT.controller.getUserInfo(1); // 김필영

    userInfo.once("value")
        .then(function(snapshot) {
            console.log("개인 데이터");
            console.log(snapshot.val().name);
            console.log(snapshot.val().phone);
            user_state = snapshot.val().state;
            console.log(user_state);
            console.log(snapshot.val().team);

            switch (user_state) {
                case "absence":
                    led_absent.writeSync(1);
                    led_working.writeSync(0);
                    led_inMind.writeSync(0);
                    break;
                default:
                    led_absent.writeSync(0);
                    led_working.writeSync(0);
                    led_inMind.writeSync(0);
            }
        });
}, 1000);

setTimeout(function() {
    clearInterval(iv);
    led_absent.writeSync(0);
    led_absent.unexport();
    led_working.writeSync(0);
    led_working.unexport();
    led_inMind.writeSync(0);
    led_inMind.unexport();
}, 20000);