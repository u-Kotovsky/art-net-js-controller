const log4js = require('log4js')
const fs = require('fs')
const { KeyFrame, Animation } = require('./animation-helpers');
const { create_data_array } = require('./array-helpers')
const { VRSL_Spotlight } = require('../fixtures/vrsl-spotlight');

let logger = log4js.getLogger('Core')
logger.level = log4js.levels.ALL;
logger.info('init')

class Patch {
    data = []
    devices = []

    constructor() {
        console.log('patch init')
    }

    load_patch_from_file(path_to_file) {
        let patch = load_patch_from_file(path_to_file)
        this.devices.push(patch)
        this.data.push(create_data_array(512, 0))
    }

    update_patch(deltaTime, callback) {
        let nextIndex = 0;

        for (let universe = 0; universe < this.devices.length; universe++) {
            if (this.devices[universe] == null)  throw new Error(`patch devices ${i} is null`)
            for (let i = 0; i < this.devices[universe].length; i++) {
                if (this.devices[universe][i] == null)  throw new Error(`patch universe ${universe} ${i} is null`)
                this.devices[universe][i].update(deltaTime);

                let values = this.devices[universe][i].get_values()
                for (let j = 0; j < values.length; j++) { // channels inside a patch
                    this.data[universe][nextIndex] = values[j]
                    nextIndex++;
                }
            }
        }

        callback()
    }
}

function load_patch_from_file(path_to_file) {
    if (!fs.existsSync(path_to_file)) 
        throw `File does not exist. '${path_to_file}' Is not correct path to a file.`
    
    let patch = []
    let data = fs.readFileSync(path_to_file);
    let json = JSON.parse(data)

    for (let i = 0; i < json.fixtures.length; i++) {
        const block = json.fixtures[i]
        let objClass = null;
        let type = block.type;

        switch (type) {
            case 'spotlight':
                objClass = VRSL_Spotlight
                break;
            default:
                throw `Failed to get type of '${type}' at '${i}' index`;
        }

        let animations = []
        for (let j = 0; j < block.animations.length; j++) {
            const animation = block.animations[j];
            let _animation = new Animation([], animation.loop)
            for (let k = 0; k < animation.keyframes.length; k++) {
                const keyframe = animation.keyframes[k];
                _animation.keyframes.push(new KeyFrame(keyframe.path, keyframe.time, keyframe.value))
            }

            _animation.apply_keyframes_to_data()
            animations.push(_animation);
        }

        for (let j = 0; j < block.repeat; j++) {
            let obj = new objClass()
            obj.animations = animations;
            patch.push(obj)
        }
    }

    return patch
}

var activePatch = new Patch() // program instance

module.exports = { load_patch_from_file, Patch, activePatch }