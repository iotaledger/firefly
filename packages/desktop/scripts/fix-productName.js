/**
 * Electron reads the app name from the productName property of the package.json. For alpha and beta releases,
 * we need to rename the app so that it stores user data in the correct folders. This is also used in
 * electron/lib/aboutPreload.
 */

const { readFile, writeFile } = require('fs/promises')
const path = require('path')

/**
 *
 * @param {string} appName
 * @returns void
 */
module.exports = async (appName) => {
    const packageJsonPath = path.resolve(__dirname, '../package.json')

    const packageJson = JSON.parse(await readFile(packageJsonPath, { encoding: 'utf-8' }))
    packageJson.productName = appName

    // Write out package.json with 4 spaces indentation and a trailing newline
    await writeFile(packageJsonPath, JSON.stringify(packageJson, null, 4).concat('\n'))
}
