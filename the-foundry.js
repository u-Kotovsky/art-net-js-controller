const artnet = require('./art-net')
const { Random } = require('./random');
const simplex = require('simplex-noise')
let s = new artnet.Art_Net()

const { create_data_array, fill_array_random } = require('./helpers/array-helpers')
const { lerp, range_to_range, clamp } = require('./helpers/math-helpers')
const { KeyFrame, Animation } = require('./helpers/animation-helpers')

let data = create_data_array()
//s.set(0, data)
//fill_array_random(data)
//s.set(0, data)

// okay so, to patch all that shit
class MovingHead {
    pan = 125;  pan_fine = 125
    tilt = 125; tilt_fine = 125
    zoom = 125
    dimmer = 0
    strobe = 0
    red = 0;  green = 0;  blue = 0
    gobo_wheel = 0; gobo_index = 0
    pan_tilt_speed = 0

    animations = []

    // animations can be attached to this class
    // and played from update method.
    set_default_channels() {
        this.dimmer = 255
        this.red = 255

        // simple loop animation
        let anim1 = new Animation([
            new KeyFrame('red', 0,255),
            new KeyFrame('green', 0, 255),
            new KeyFrame('blue', 0, 255),
            new KeyFrame('dimmer', 0, 0),

            new KeyFrame('dimmer', 5, 175),
            new KeyFrame('red', 4, 255),
            new KeyFrame('green', 4, 255),
            new KeyFrame('blue', 4, 255),

            new KeyFrame('red', 5, 0),
            new KeyFrame('green', 5, 0),
            new KeyFrame('blue', 5, 0),
        ], true)
        /*let anim1 = new Animation([
            new KeyFrame('dimmer', 0, 0),

            new KeyFrame('red', 0, 255),
            new KeyFrame('green', 0, 0),
            new KeyFrame('blue', 0, 255),

            new KeyFrame('dimmer', 1, 255),
            new KeyFrame('dimmer', 2, 0),
            new KeyFrame('dimmer', 3, 255),
            new KeyFrame('dimmer', 4, 0),
            new KeyFrame('dimmer', 5, 255),

            new KeyFrame('dimmer', 6, 0),
            new KeyFrame('red', 6, 0),
            new KeyFrame('green', 6, 0),
            new KeyFrame('blue', 6, 0),
        ], true)*/

        /*let anim2 = new Animation([
            new KeyFrame('green', 0, 0),
            new KeyFrame('green', 3, 255),
            new KeyFrame('green', 6, 0),
        ])
        let anim3 = new Animation([
            new KeyFrame('tilt', 0, 125-45),
            new KeyFrame('tilt', 3, 125),
            new KeyFrame('tilt', 6, 125+45),
        ])*/

        //anim1.apply_keyframes_to_data() // do this after adding all the keyframes you need!!!!
        // or maybe I should do .addKeyFrame and it'll call apply_keyframes_to_data automatically but will increase load slightly.
        //console.log(anim1.keyframes)

        this.animations.push(anim1);//, anim2, anim3)
    }

    get_values() {
        return [this.pan, this.pan_fine, this.tilt, this.tilt_fine, this.zoom, this.dimmer, this.strobe, 
            this.red, this.green, this.blue, this.gobo_wheel, this.gobo_index, this.pan_tilt_speed]
    }

    _timer = 0
    _maxTime = 5
    _reverse = false
    _noise = simplex.createNoise2D()

    update(deltaTime) {
        this._timer += deltaTime
        if (this._timer > this._maxTime) {
            this._timer = 0
        }
        //let lerped = clamp(
        //    lerp(0, 1, range_to_range(this._noise(this._timer, this._timer *2), 0, this._maxTime, 0, 1)), 
        //    0, 1)
        //this.dimmer = clamp(lerp(0, 255, range_to_range(this._noise(0, this._timer), 0, this._maxTime, 0, 1)), 0, 255)
        //this.dimmer = lerped * 255 * .8

        //this.red = clamp(lerp(0, 1,this._noise(this._timer, this._timer *2))*255, 0, 255)
        //this.green = clamp(lerp(0, 1, this._noise(this._timer, this._timer *2))*255, 0, 255)
        //this.blue = clamp(lerp(0, 1, this._noise(this._timer, this._timer *2))*255, 0, 255)

        for (let i = 0; i < this.animations.length; i++) {
            let animation = this.animations[i]

            for (let j = 0; j < this.animations[i].keyframes.length; j++) {
                let keyframe = this.animations[i].keyframes[j];
            }

            animation.update(deltaTime, this)
        }
    }
}

// Creating a patch
let patch = []
let offset = 0;
for (let i = 0; i < 25; i++) {
    patch[i] = new MovingHead();
    patch[i].set_default_channels();
}
offset += patch.length

//for (let i = 0; i < 6; i++) {
//    patch[offset + i] = new MovingHead();
//    patch[offset + i].set_default_channels();
//}
console.log(`patch elements: ${patch.length}`)


// Writing values to data
function write_patch_to_data() {
    let nextIndex = 0;
    for (let i = 0; i < patch.length; i++) {
        let values = patch[i].get_values()
        for (let j = 0; j < values.length; j++) { // channels inside a patch
            data[nextIndex] = values[j]
            nextIndex++;
        }
    }

    s.set(0, data)
}

//write_patch_to_data()
//s.set(0, data)

function update_patch(deltaTime) {
    let nextIndex = 0;
    for (let i = 0; i < patch.length; i++) {
        if (patch[i] == null)  throw new Error(`patch ${i} is null`)
        patch[i].update(deltaTime);

        let values = patch[i].get_values()
        for (let j = 0; j < values.length; j++) { // channels inside a patch
            data[nextIndex] = values[j]
            nextIndex++;
        }
    }

    s.set(0, data)
}

let killswitch = false;
function update(deltaTime = 1) {
    if (killswitch) {
        console.log('KillSwitch!');
        return;
    }
    //write_patch_to_data()
    update_patch(deltaTime)
}

try {
    let tick = performance.now() // ms
    let tick2 = tick;
    let delay = 0
    setInterval(() => {
        delay = (tick - tick2);
        update(delay * .001)
        tick2 = tick;
        tick = performance.now()
        //console.log(`${delay} ${tick2} ${tick}`)
    }, 0)
} catch (e) {
    console.error(e)
}