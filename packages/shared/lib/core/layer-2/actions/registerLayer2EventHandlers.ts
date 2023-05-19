import { updateSelectedAccount } from '@core/account/stores'
import { Platform } from '@core/app/classes'

export function registerLayer2EventHandlers(): void {
    Platform.onEvent('evm-address', (evmAddress: string) => {
        updateSelectedAccount({ evmAddress: evmAddress })
    })
}
