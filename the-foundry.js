const { Art_Net } = require('./art-net')
const log4js = require('log4js')
const { create_data_array, fill_array_random } = require('./helpers/array-helpers')
const { load_patch_from_file } = require('./helpers/patch-helpers')

let artnet = new Art_Net()
let logger = log4js.getLogger('Core')
logger.level = log4js.levels.ALL;
logger.info('init')

let data = create_data_array()
let patch = load_patch_from_file('patches/the-foundry.json')
logger.info(`patch elements: ${patch.length}`)

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

    // todo: universe based on channel index (?)
    artnet.set(0, data)
}

let killswitch = false;
function update(deltaTime = 1) {
    if (killswitch) {
        console.log('KillSwitch!');
        return;
    }
    
    update_patch(deltaTime)
}

// Main update function
try {
    let tick = performance.now() // ms
    let tick2 = tick;
    let delay = 0
    setInterval(() => {
        delay = (tick - tick2);
        update(delay * .001)
        tick2 = tick;
        tick = performance.now()
    }, 0)
} catch (e) {
    console.error(e)
}