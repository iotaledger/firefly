import { localize } from '@core/i18n'
import { showAppNotification } from '@auxiliary/notification'

export function showNetworkIssuesNotification(): void {
    showAppNotification({
        type: 'warning',
        message: localize('indicators.networkIndicator.warningText'),
    })
}
