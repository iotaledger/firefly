const { execSync } = require('child_process')
const path = require('path')
const bindingPath = path.resolve(__dirname, '../../../../backend/bindings/node')

execSync('yarn', { cwd: bindingPath, stdio: 'inherit' })
