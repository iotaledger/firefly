/**
 * Electron reads the app name from the productName property of the package.json. For alpha and beta releases,
 * we need to rename the app so that it stores user data in the correct folders. This is also used in
 * electron/lib/aboutPreload.
 */

const { readFileSync, writeFileSync } = require('fs')
const path = require('path')

if (!process.env.CI) {
    console.warn('Warning: These changes should not be checked into Git!')
}

const stage = process.env.STAGE || 'alpha'
const appName =
    stage === 'prod' ? 'Firefly Stardust' : `Firefly Stardust - ${stage.replace(/^\w/, (c) => c.toUpperCase())}`
const packageJsonPath = path.resolve(__dirname, '../package.json')

const packageJson = JSON.parse(readFileSync(packageJsonPath, { encoding: 'utf-8' }))
packageJson.productName = appName

// Write out package.json with 4 spaces indentation and a trailing newline
writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 4).concat('\n'))
