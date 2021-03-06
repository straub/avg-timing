
function Timing(config) {
    this.config = config || { short: 100, long: 1000 };

    this._stats = {};
    this._averagers = {};
}

Timing.prototype.start = function startTime(name) {
    var timing = this,
        start = +(new Date()),
        stopped = false;

    var _stopTime = function _stopTime() {
        if (stopped) return;
        stopped = true;

        var statName = _stopTime.statName,
            stop = +(new Date()),
            time = stop - start;

        timing._averagers[statName] = timing._averagers[statName] || timing._newStat(statName);

        Object.keys(timing._stats[statName]).forEach(function (key) {
            timing._stats[statName][key] = timing._averagers[statName][key](time);
        });

        return time;
    };

    _stopTime.statName = name;

    return _stopTime;
};

Timing.prototype.stats = function getStats(key) {
    if (typeof key != 'undefined') return this._stats[key];
    return this._stats;
};

Timing.prototype._newStat = function _newStat(name) {
    var timing = this,
        stat = {};

    this._stats[name] = {};

    Object.keys(this.config).forEach(function (key) {
        stat[key] = new SlightlyMoreComplexMovingAverager(timing.config[key]);
        timing._stats[name][key] = null;
    });

    return stat;
};

Timing.prototype.Timing = Timing;

module.exports = new Timing();

// Implementation from http://rosettacode.org/wiki/Averages/Simple_moving_average#JavaScript
function SlightlyMoreComplexMovingAverager(period) {
    var nums = [],
        count = 0,
        allTimeMax = -Infinity,
        allTimeMin = Infinity;
    return function (num) {
        nums.push(num);
        if (nums.length > period) {
            nums.shift();  // remove the first element of the array
        }
        var sum = 0;
        for (var i in nums) {
            sum += nums[i];
        }
        var n = period;
        if (nums.length < period) {
            n = nums.length;
        }
        count++;
        if (num > allTimeMax) allTimeMax = num;
        if (num < allTimeMin) allTimeMin = num;
        return {
            avg: (sum/n),
            count: count,
            period: period,
            length: nums.length,
            max: Math.max.apply(null, nums),
            min: Math.min.apply(null, nums),
            allTimeMax: allTimeMax,
            allTimeMin: allTimeMin
        };
    };
}
