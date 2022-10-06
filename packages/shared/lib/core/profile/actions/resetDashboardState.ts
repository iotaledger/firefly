import { updateSelectedAccount } from '@core/account'

export function resetDashboardState(): void {
    updateSelectedAccount({ isTransferring: false })
}
