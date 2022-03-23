import { Platform } from '@core/platform'
import { WalletApi } from '@core/shell'

import { IWalletApi } from './interfaces'

export const api: IWalletApi = new Proxy(
    { ...WalletApi },
    {
        get: (target, propKey) => {
            /* eslint-disable @typescript-eslint/no-explicit-any */
            const _handleCallbackError = (err: any) => {
                const title = `Callback Error ${propKey.toString()}`

                console.error(title, err)
                void Platform.unhandledException(title, { message: err?.message, stack: err?.stack })
            }

            /* eslint-disable @typescript-eslint/no-explicit-any */
            const _handleCallbackResult = (args: any[], idx: number, result: 'onSuccess' | 'onError'): any[] => {
                const originalResultFn = args[idx][result]

                args[idx][result] = (payload) => {
                    try {
                        originalResultFn(payload)
                    } catch (err) {
                        _handleCallbackError(err)
                    }
                }

                return args
            }

            const originalMethod = target[propKey]

            return (...args) => {
                for (let i = args.length - 1; i >= 0; i--) {
                    if (args[i]?.onSuccess) {
                        args = _handleCallbackResult(args, i, 'onSuccess')
                    } else if (args[i]?.onError) {
                        args = _handleCallbackResult(args, i, 'onError')
                    }
                }

                return originalMethod.apply(target, args)
            }
        },
    }
)
