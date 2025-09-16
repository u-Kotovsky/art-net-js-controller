const simplex = require('simplex-noise')

// animations can be attached to this class
// and played from update method.
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

    set_default_channels() {}
    get_values = () =>
        [this.pan, this.pan_fine, this.tilt, this.tilt_fine, this.zoom, this.dimmer, this.strobe, 
            this.red, this.green, this.blue, this.gobo_wheel, this.gobo_index, this.pan_tilt_speed]

    _timer = 0
    _maxTime = 5
    _reverse = false
    _noise = simplex.createNoise2D()

    update(deltaTime) {
        this._timer += deltaTime
        if (this._timer > this._maxTime) this._timer = 0

        for (let i = 0; i < this.animations.length; i++)
            this.animations[i].update(deltaTime, this)
    }
}

module.exports = { VRSL_Spotlight }