const { resolve } = require('path')
const { spawnSync } = require('child_process')

spawnSync(process.platform === 'win32' ? 'yarn.cmd' : 'yarn', ['build:api'], { stdio: 'inherit', cwd: resolve(__dirname, '../') })
spawnSync(process.platform === 'win32' ? 'yarn.cmd' : 'yarn', ['build:binding'], { stdio: 'inherit', cwd: resolve(__dirname, '../') })
