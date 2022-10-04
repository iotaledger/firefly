import { contextBridge } from 'electron'
import { AboutApi } from '../apis'

contextBridge.exposeInMainWorld('about', AboutApi)
