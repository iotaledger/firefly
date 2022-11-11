import { RouterManagerExtensionName } from '../enums'
import { RouterManagerExtensionFunction } from './router-manager-extension-function.type'

export type RouterManagerExtension = [RouterManagerExtensionName, RouterManagerExtensionFunction]
