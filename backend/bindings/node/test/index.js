const lib = require('../lib')
const assert = require('assert')
const fs = require('fs')

describe('binding', () => {
  /* it('gets an event', () => {
    lib.init()
    lib.onMessage(console.log)
    lib.listenToErrorEvents()
  }) */
  it('creates an account, backup and restore it', () => {
    fs.rmdirSync('./example-database', {
      recursive: true
    })
    after(() => {
      try {
        fs.rmdirSync('./backup', {
          recursive: true
        })
      } catch {}
    })

    return new Promise(resolve => {
      lib.init()
    let index = 0
    lib.onMessage(message => {
      console.log(message)
      switch (index++) {
        case 0: {
          assert.deepStrictEqual(message, {
            id: message.id,
            type: 'StrongholdPasswordSet'
          })
          lib.createAccount({
            clientOptions: {
              node: 'https://nodes.devnet.iota.org:443'
            }
          })
          break
        }
        case 1: {
          assert.deepStrictEqual(message, {
            id: message.id,
            type: 'CreatedAccount',
            payload: message.payload
          })
          lib.backup('./backup')
          break
        }
        case 2: {
          assert.deepStrictEqual(message, {
            id: message.id,
            type: 'BackupSuccessful'
          })
          fs.unlinkSync('./example-database/snapshot')
          lib.setStrongholdPassword('password') // since we removed the snapshot, reload stronghold
          break
        }
        case 3: {
          assert.deepStrictEqual(message, {
            id: message.id,
            type: 'StrongholdPasswordSet'
          })
          lib.restoreBackup('./backup')
          break
        }
        case 4: {
          assert.deepStrictEqual(message, {
            id: message.id,
            type: 'BackupRestored'
          })
          resolve()
          break
        }
      }
    })
    lib.setStrongholdPassword('password')
    })
  })
})