const { lerp, range_to_range, clamp } = require('./math-helpers')

class KeyFrame {
    path = '' // a patch to update in fixture object
    value = 0
    time = 0

    constructor(path = '', time = 0, value = 0) {
        this.path = path;
        this.time = time;
        this.value = value
    }
}

class Animation {
    keyframes = []
    timer = 0
    max_time = 0
    active = true;
    loop = false

    constructor(keyframes = [], loop = false) {
        this.keyframes = keyframes;
        this.apply_keyframes_to_data()
        this.loop = loop;
    }

    set_end_time() {
        this.max_time = this.get_end_time()
    }

    get_end_time() {
        let endTime = 0;
        this.keyframes.forEach(keyframe => {
            if (keyframe.time > endTime) endTime = keyframe.time;
        })
        return endTime;
    }

    // SO we need to collect all keyframes that use same path into
    // array where they all sorted by path and time (?, maybe wont do that since we are still looping through the whole
    // animation to find all closest keyframes.)

    data = {
        // basically will be something like this after conversion. (after Play() has been invoked.)
        //dimmer: [ { time: 0, value: 0 }, { time: 5, value: 255 }, ],
        //zoom: [ { time: 0, value: 0 }, { time: 5, value: 255 }, ]
    }

    // do this after adding all the keyframes you need!!!!
    // or maybe I should do .addKeyFrame and it'll call apply_keyframes_to_data automatically but will increase load slightly.
    apply_keyframes_to_data() {
        let _data = {}
        for (let i = 0; i < this.keyframes.length; i++) {
            let keyframe = this.keyframes[i]
            if (keyframe == null) throw new Error(`keyframe at ${i} is null`)
            _data[keyframe.path] ??= []

            _data[keyframe.path].push({
                time: keyframe.time,
                value: keyframe.value
            })
        }

        let names =  Object.getOwnPropertyNames(_data);
        for (let i = 0; i < names.length; i++) { // sort elements by time
            _data[names[i]] = _data[names[i]].sort(({time:a}, {time:b}) => a-b);
        }

        this.data = _data;
        this.set_end_time()
    }

    update(deltaTime, root) {
        // root - object to update.
        if (!this.active) return;

        this.timer += deltaTime;
        if (this.timer > this.max_time) {
            this.active = this.loop;
            this.timer = 0; // or turn off animation, or reverse it's playback.
        }

        let names = Object.getOwnPropertyNames(this.data);
        
        // I Should've called previous keyframe and next keyframe, but I fucked up there lol
        let prev_keyframe = null
        let next_keyframe = null

        // I basically should find closest smallest and bigger keyframe to existing current value of timer
        // so then we can lerp it between those timecodes.

        // Okay so it fails when there's multiple keyframes at the max or min keyframe 
        // it searches for global one but needs local based on timer.

        for (let i = 0; i < names.length; i++) {
            const path = this.data[names[i]]

            for (let j = path.length - 1; j >= 0; j--) {
                const keyframe = path[j];

                prev_keyframe ??= keyframe; // null fallback
                next_keyframe ??= keyframe;

                // Apply as min keyframe
                if (keyframe.time <= this.timer
                    && keyframe.time <= prev_keyframe.time
                ) {
                    prev_keyframe = keyframe;
                    // get next keyframe from here
                    if (j < path.length - 1) {
                        next_keyframe = path[j + 1]
                        break;
                    }
                }
            }

            root[names[i]] = 
                clamp(
                    lerp(
                    prev_keyframe.value, 
                    next_keyframe.value, 
                    range_to_range(this.timer, prev_keyframe.time, next_keyframe.time, 0, 1)
                ), 0, 255)
        }
    }
}

module.exports = { KeyFrame, Animation }