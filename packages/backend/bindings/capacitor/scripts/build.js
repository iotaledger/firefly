const { resolve } = require('path');
const { spawnSync } = require('child_process')

spawnSync(process.platform === 'win32' ? 'yarn.cmd' : 'yarn', ['build:clean', 'build:bundle'], {
    stdio: "inherit",
    cwd: resolve(__dirname, '../'),
})
