const log4js = require('log4js')
const { Art_Net } = require('./art-net')
const { activePatch } = require('./helpers/patch-helpers')

const webpanel = require('./webpanel/server')

let artnet = new Art_Net()
let logger = log4js.getLogger('Core')
logger.level = log4js.levels.ALL;
logger.info('init')

activePatch.load_patch_from_file('patches/stage-flight.json') // patches/the-foundry.json
logger.info(`patch devices: ${activePatch.devices.length}`)

let killswitch = false;
const update = (deltaTime = 1) => {
    if (killswitch) {
        logger.info('KillSwitch!');
        return;
    }

    activePatch.update_patch(deltaTime, () => {
        for (let universe = 0; universe < activePatch.data.length; universe++) {
            artnet.set(universe, activePatch.data[universe])
        }
    })
}

// Main update function
try {
    let tick = performance.now() // ms
    let tick2 = tick;
    let delay = 0
    setInterval(() => {
        delay = (tick - tick2) * .0001;
        update(delay)
        tick2 = tick;
        tick = performance.now()
    }, 0)
} catch (e) {
    console.error(e)
}