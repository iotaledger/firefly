import { contextBridge } from 'electron'
import { ErrorApi } from '../apis'

contextBridge.exposeInMainWorld('error', ErrorApi)
