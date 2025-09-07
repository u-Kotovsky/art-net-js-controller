const simplex = require('simplex-noise')

// okay so, to patch all that shit
class VRSL_Spotlight {
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
    set_default_channels() {}

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
        if (this._timer > this._maxTime) //{
            this._timer = 0
        //}
        //let lerped = clamp(
        //    lerp(0, 1, range_to_range(this._noise(this._timer, this._timer *2), 0, this._maxTime, 0, 1)), 
        //    0, 1)
        //this.dimmer = clamp(lerp(0, 255, range_to_range(this._noise(0, this._timer), 0, this._maxTime, 0, 1)), 0, 255)
        //this.dimmer = lerped * 255 * .8

        //this.red = clamp(lerp(0, 1,this._noise(this._timer, this._timer *2))*255, 0, 255)
        //this.green = clamp(lerp(0, 1, this._noise(this._timer, this._timer *2))*255, 0, 255)
        //this.blue = clamp(lerp(0, 1, this._noise(this._timer, this._timer *2))*255, 0, 255)

        for (let i = 0; i < this.animations.length; i++) {
            //let animation = this.animations[i]

            //for (let j = 0; j < this.animations[i].keyframes.length; j++) {
            //    let keyframe = this.animations[i].keyframes[j];
            //}

            this.animations[i].update(deltaTime, this)
        }
    }
}

module.exports = { VRSL_Spotlight }