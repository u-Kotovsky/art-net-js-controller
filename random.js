class Random {
	static UUIDGeneratorBrowser = () =>
		([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
			(c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16)
		);
  	static hexColorCode = () => {
		let n = (Math.random() * 0xfffff * 1000000).toString(16);
    	return '#' + n.slice(0, 6);
	};
  	static numberInRange = (min, max) => Math.random() * (max - min) + min;

  	static rgb = (min = 0, max = 255) => {
    	return `rgb(${Random.numberInRange(min, max)}, ${Random.numberInRange(min, max)}, ${Random.numberInRange(min, max)})`
  	}
  	static rgba = (alpha = Random.numberInRange(0, 255)) => {
    	return `rgb(${Random.numberInRange(0, 255)}, ${Random.numberInRange(0, 255)}, ${Random.numberInRange(0, 255)}, ${alpha})`
  	}
  	static grayscale = (min = 0, max = 255) => {
		let rnd = Random.numberInRange(min, max);
    	return `rgb(${rnd}, ${rnd}, ${rnd})`
  	}
}

module.exports = { Random }