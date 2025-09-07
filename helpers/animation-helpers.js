// add animation system
// two key frames
// loop between them
// tween

const { lerp, range_to_range, clamp } = require("./math-helpers")

class KeyFrame {
    data_reference = '' // a path, or maybe an id of fixture/channel, dunno
    path = ''
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

    apply_keyframes_to_data() {
        let _data = {}
        for (let i = 0; i < this.keyframes.length; i++) {
            let keyframe = this.keyframes[i]
            if (keyframe == null) throw new Error(`keyframe at ${i} is null`)
            if (_data[keyframe.path] == null) _data[keyframe.path] = []

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
        let min_keyframe = null
        let max_keyframe = null

        // I basically should find closest smallest and bigger keyframe to existing current value of timer
        // so then we can lerp it between those timecodes.

        // Okay so it fails when there's multiple keyframes at the max or min keyframe 
        // it searches for global one but needs local based on timer.

        for (let i = 0; i < names.length; i++) {
            const path = this.data[names[i]]

            for (let j = path.length - 1; j >= 0; j--) {
                const keyframe = path[j];

                // Null fallbacks
                if (min_keyframe == null) min_keyframe = keyframe;
                if (max_keyframe == null) max_keyframe = keyframe;

                // Apply as min keyframe
                if (keyframe.time <= this.timer) {
                    if (keyframe.time <= min_keyframe.time) {
                        min_keyframe = keyframe;
                        // get next keyframe from here
                        if (j < path.length - 1) {
                            max_keyframe = path[j + 1]
                            break;
                        }
                    }
                }

                // Apply as max keyframe
                /*if (max_keyframe == null && keyframe.time > target) {
                    if (debug) console.log(`${stat} max_keyframe may be applied here time: '${keyframe.time}' `)
                    if (keyframe.time > max_keyframe.time) {
                        if (debug) console.log(`${stat} max_keyframe is now time: '${keyframe.time}' `)
                        max_keyframe = keyframe;
                    }
                } else {
                    if (debug) console.log(`${stat} (max) keyframe is too high '${keyframe.time} < ${target}' `)
                }*/

                // this.timer == current time that we searching for
                //if (keyframe.time < min_keyframe.time) 
            }

            root[names[i]] = clamp(lerp(
                min_keyframe.value, 
                max_keyframe.value, 
                range_to_range(this.timer, min_keyframe.time, max_keyframe.time, 0, 1)), 0, 255)

            //throw 0
            /*path.forEach(keyframe => {
                if (keyframe.time > )
                console.log(keyframe)
                throw keyframe;
            })*/
        }
    }
}


/*// Ping-pong loop.
if (this._reverse) {
    this.dimmer -= 1;
    if (this.dimmer < 0) {
        this.dimmer = 1
        this._reverse = !this._reverse
    }
} else {
    this.dimmer += 1;
    if (this.dimmer > 255) {
        this.dimmer = 254
        this._reverse = !this._reverse
    }
}*/

module.exports = { KeyFrame, Animation }