avg-timing
==========

average timing helpers for performance monitoring

# Use

```javascript
var timing = require('avg-timing');

var stop = timing.start('my-operation-name');

setTimeout(function () {
    stop();

    console.log(timing.stats());
}, 1000);
```