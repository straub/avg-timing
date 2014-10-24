
var avgTimes = {},
    averagers = {},
    config = { short: 100, long: 1000 };

module.exports = {
    start: function startTime(name) {
        var start = +(new Date()),
            stopped = false;

        return function stopTime() {
            if (stopped) return;
            stopped = true;

            var stop = +(new Date());

            averagers[name] = averagers[name] || newStat(name, module.exports.config);

            Object.keys(avgTimes[name]).forEach(function (key) {
                avgTimes[name][key] = averagers[name][key](stop - start);
            });
        };
    },
    stats: function getStats(key) {
        if (typeof key != 'undefined') return avgTimes[key];
        return avgTimes;
    },
    config: config
};

function newStat(name, config) {
    var stat = {};
    avgTimes[name] = {};

    Object.keys(config).forEach(function (key) {
        stat[key] = new SimpleMovingAverager(config[key]);
        avgTimes[name][key] = null;
    });

    return stat;
}

// Implementation from http://rosettacode.org/wiki/Averages/Simple_moving_average#JavaScript
function SimpleMovingAverager(period) {
    var nums = [];
    return function (num) {
        nums.push(num);
        if (nums.length > period)
            nums.splice(0,1);  // remove the first element of the array
        var sum = 0;
        for (var i in nums)
            sum += nums[i];
        var n = period;
        if (nums.length < period)
            n = nums.length;
        return(sum/n);
    };
}
