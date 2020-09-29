const lib = require('../lib')
const assert = require('assert')

describe('binding', () => {
  it('sends a message and gets the response', () => {
    lib.init()
    lib.createAccount({
      clientOptions: {
        node: 'https://nodes.devnet.iota.org:443'
      }
    }).then(response => {
      assert.deepStrictEqual(response, {
        type: "CreatedAccount"
      })
    })
  })
})