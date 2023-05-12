import { Platform } from '@core/app'
import { updateSelectedAccount } from '@core/account'

export function registerLayer2EventHandlers(): void {
    Platform.onEvent('evm-address', (evmAddress: string) => {
        updateSelectedAccount({ evmAddress: evmAddress })
    })
}
