const { contextBridge } = require('electron')
const { version, build: { productName } } = require('../../package.json')
import { menuState } from './menuState'

contextBridge.exposeInMainWorld('app', { appName: productName, version: `${menuState.strings.version} ${version}`, iconPath: './assets/logos/firefly_logo.svg' })