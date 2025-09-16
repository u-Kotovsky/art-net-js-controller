const create_data_array = (length = 512, default_value = 0) => {
    let data = []
    for (let i = 0; i < length; i++) data[i] = default_value;
    return data;
}

const fill_array_random = (data) => {
    for (let i = 0; i < data.length; i++) 
        data[i] = Random.numberInRange(0, 255);
}

module.exports = { create_data_array, fill_array_random }