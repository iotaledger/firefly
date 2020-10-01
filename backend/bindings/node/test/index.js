const lib = require('../lib')
const assert = require('assert')
const fs = require('fs')

describe('binding', () => {
  it('creates an account, backup and restore it', async () => {
    lib.init()
    lib.setStrongholdPassword('password')
    const createResponse = await lib.createAccount({
      clientOptions: {
        node: 'https://nodes.devnet.iota.org:443'
      }
    })
    assert.strictEqual(createResponse.type, 'CreatedAccount')
    try {
      const backupResponse = await lib.backup('./backup')
      assert.strictEqual(backupResponse.type, 'BackupSuccessful')
      fs.unlinkSync('./example-database/snapshot')
      lib.setStrongholdPassword('password') // since we removed the snapshot, reload stronghold
      const restoreResponse = await lib.restoreBackup('./backup')
      assert.strictEqual(restoreResponse.type, 'BackupRestored')
    } finally {
      try {
        fs.rmdirSync('./backup', {
          recursive: true
        })
      } catch {}
    }
  })
})