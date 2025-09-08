function lerp(x, y, t) {
    return x * t + y * (1 - t)
}

function range_to_range(OldValue, OldMin, OldMax, NewMin, NewMax) {
    return (((OldValue - OldMin) * (NewMax - NewMin)) / (OldMax - OldMin)) + NewMin;
}

function clamp(value, min, max) {
    if (value > max) return max;
    if (value < min) return min;
    return value;
}

module.exports = { lerp, range_to_range, clamp }