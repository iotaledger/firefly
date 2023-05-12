import { updateSelectedAccount } from '@core/account/stores'
import { Platform } from '@core/app'

export function requestEvmAddress(): void {
    try {
        Platform.onEvent('evm-address', (evmAddress: string) => {
            updateSelectedAccount({ evmAddress })
        })
        Platform.requestEvmAddress()
    } catch (err) {
        console.error(err)
    }
}
