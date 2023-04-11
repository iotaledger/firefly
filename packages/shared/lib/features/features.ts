/* eslint-disable no-undef */
import { IFeatures } from './interfaces'

// @ts-expect-error: This value is replaced by Webpack DefinePlugin
export default JSON.parse(features) as IFeatures
