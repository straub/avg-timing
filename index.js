
var defaultConfig = { short: 100, long: 1000 };

function Timing(config) {
    this.config = config;

    this.avgTimes = {};
    this.averagers = {};
}

Timing.prototype.start = function startTime(name) {
    var timing = this,
        start = +(new Date()),
        stopped = false;

    return function stopTime() {
        if (stopped) return;
        stopped = true;

        var stop = +(new Date());

        timing.averagers[name] = timing.averagers[name] || timing._newStat(name);

        Object.keys(timing.avgTimes[name]).forEach(function (key) {
            timing.avgTimes[name][key] = timing.averagers[name][key](stop - start);
        });
    };
};

Timing.prototype.stats = function getStats(key) {
    if (typeof key != 'undefined') return this.avgTimes[key];
    return this.avgTimes;
};

Timing.prototype._newStat = function _newStat(name) {
    var timing = this,
        stat = {};

    this.avgTimes[name] = {};

    Object.keys(this.config).forEach(function (key) {
        stat[key] = new SimpleMovingAverager(timing.config[key]);
        timing.avgTimes[name][key] = null;
    });

    return stat;
};

Timing.Timing = Timing;

module.exports = new Timing(defaultConfig);

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
