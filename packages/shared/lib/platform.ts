import { IPlatform, Platforms } from './typings/platform'

const IS_MOBILE = process.env.PLATFORM === Platforms.MOBILE

export const Platform: IPlatform = window[IS_MOBILE ? '__CAPACITOR__' : '__ELECTRON__']
