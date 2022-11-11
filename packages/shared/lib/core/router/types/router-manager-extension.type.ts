import { RouterManagerExtensionName } from '../enums'

export type RouterManagerExtension = [RouterManagerExtensionName, (..._: unknown[]) => unknown]
