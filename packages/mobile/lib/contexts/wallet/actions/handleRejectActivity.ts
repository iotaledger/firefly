import { localize } from '@core/i18n'
import { rejectActivity } from '@core/wallet'
import { closeDrawer, DrawerId, openDrawer } from '../../../auxiliary/drawer'

export function handleRejectActivity(activityId: string): void {
    const _onConfirm = (): void => {
        rejectActivity(activityId)
        closeDrawer(DrawerId.Confirm)
    }
    openDrawer(DrawerId.Confirm, {
        title: localize('actions.confirmRejection.title'),
        description: localize('actions.confirmRejection.description'),
        hint: localize('actions.confirmRejection.node'),
        info: true,
        confirmText: localize('actions.reject'),
        warning: true,
        onConfirm: _onConfirm,
    })
}
