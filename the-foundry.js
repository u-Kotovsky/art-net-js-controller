const artnet = require('./art-net')
const log4js = require('log4js')
const { create_data_array, fill_array_random } = require('./helpers/array-helpers')
const { lerp, range_to_range, clamp } = require('./helpers/math-helpers')
const { KeyFrame, Animation } = require('./helpers/animation-helpers');
const { VRSL_Spotlight } = require('./fixtures/vrsl-spotlight');

let s = new artnet.Art_Net()
let logger = log4js.getLogger('Core')
logger.level = log4js.levels.ALL;
logger.info('init')

let data = create_data_array()
//s.set(0, data)
//fill_array_random(data)
//s.set(0, data)

// Creating a patch
let patch = []
let offset = 0;
for (let i = 0; i < 25; i++) {
    patch[i] = new VRSL_Spotlight();
    patch[i].set_default_channels();
    
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

    patch[i].animations.push(anim1);//, anim2, anim3)
}
offset += patch.length

//for (let i = 0; i < 6; i++) {
//    patch[offset + i] = new MovingHead();
//    patch[offset + i].set_default_channels();
//}
logger.info(`patch elements: ${patch.length}`)

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