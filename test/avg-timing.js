
var timing = require('..');

timing.config = { short: 3, long: 10 };

console.log(timing.stats());

for(var i = 0; i <= 10; i++) {
    (function () {
        var stop = timing.start('my-operation-name');

        setTimeout(function () {
            stop();

            console.log(timing.stats());
            //console.log(timing.stats('my-operation-name'));
        }, 1000 * Math.random());
    })();
}
