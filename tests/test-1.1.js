const { woah } = require('./test-1.2')

console.log(`test-1.1 counter: ${woah.counter}`)

woah.counter += 1;

const test3 = require('./test-1.3')

console.log(`test-1.1 counter: ${woah.counter}`)