const lerp = (x, y, t) =>  x * t + y * (1 - t)
const range_to_range = (old_value, old_min, old_max, new_min, new_max) =>
    (((old_value - old_min) * (new_max - new_min)) / (old_max - old_min)) + new_min
const clamp = (value, min, max) => {
    if (value > max) return max
    if (value < min) return min
    return value
}

module.exports = { lerp, range_to_range, clamp }