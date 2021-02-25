const { contextBridge } = require('electron')
const { version, build: { productName } } = require('../../package.json')

contextBridge.exposeInMainWorld('app', { appName: productName, version, iconPath: './assets/logos/firefly_logo.svg' })