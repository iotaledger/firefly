/* eslint-disable no-undef */
import { IFeatures } from './interfaces'

// @ts-expect-error: This value is replaced by Vite
const featuresObject: IFeatures = typeof features === 'string' ? JSON.parse(features) : features

export default featuresObject
