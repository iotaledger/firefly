const lib = require('../lib')
const assert = require('assert')
const fs = require('fs')

describe('binding', () => {
  it('creates an account, backup and restore it', async () => {
    fs.rmdirSync('./example-database', {
      recursive: true
    })
    lib.init()
    await lib.setStrongholdPassword('password')
    const createResponse = await lib.createAccount({
      clientOptions: {
        node: 'https://nodes.devnet.iota.org:443'
      }
    })
    assert.deepStrictEqual(createResponse, {
      type: 'CreatedAccount',
      payload: createResponse.payload
    })
    try {
      const backupResponse = await lib.backup('./backup')
      assert.deepStrictEqual(backupResponse, {
        type: 'BackupSuccessful'
      })
      fs.unlinkSync('./example-database/snapshot')
      await lib.setStrongholdPassword('password') // since we removed the snapshot, reload stronghold
      const restoreResponse = await lib.restoreBackup('./backup')
      assert.deepStrictEqual(restoreResponse, {
        type: 'BackupRestored'
      })
    } finally {
      try {
        fs.rmdirSync('./backup', {
          recursive: true
        })
      } catch {}
    }
  })
})