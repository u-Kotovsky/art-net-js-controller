const { Art_Net } = require('./art-net')
const { create_data_array, fill_array_random } = require('./helpers/array-helpers')

let artnet = new Art_Net()
let data = create_data_array()
fill_array_random(data)
artnet.set(0, data)