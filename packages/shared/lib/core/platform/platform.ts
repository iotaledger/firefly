import { PlatformType } from './enums'
import { IPlatform } from './interfaces'

const IS_MOBILE = process.env.PLATFORM === PlatformType.Mobile

export const Platform: IPlatform = window[IS_MOBILE ? '__CAPACITOR__' : '__ELECTRON__']
