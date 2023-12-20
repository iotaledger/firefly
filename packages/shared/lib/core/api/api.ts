import { IApi } from './interfaces'

declare global {
    interface Window {
        __WALLET__API__: IApi
    }
}

export const api: IApi = window['__WALLET__API__']
