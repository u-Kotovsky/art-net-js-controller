const artnet = require('./art-net')
const { Random } = require('./random');
const { create_data_array, fill_array_random } = require('./helpers/array-helpers')
const { lerp, range_to_range, clamp } = require('./helpers/math-helpers')
const { KeyFrame, Animation } = require('./helpers/animation-helpers')

let s = new artnet.Art_Net()

let data = create_data_array()
fill_array_random(data)
s.set(0, data)