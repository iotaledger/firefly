import { localize } from '@core/i18n'
import { showAppNotification } from '@lib/notifications'

export function showNetworkIssuesNotification(): void {
    showAppNotification({
        type: 'warning',
        message: localize('indicators.networkIndicator.warningText'),
    })
}
