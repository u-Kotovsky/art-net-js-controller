function create_data_array() {
    let data = []
    for (let i = 0; i < 512; i++) data[i] = 0;
    return data;
}

function fill_array_random(data) {
    for (let i = 0; i < data.length; i++) {
        data[i] = Random.numberInRange(0, 255);
    }
}

module.exports = { create_data_array, fill_array_random }