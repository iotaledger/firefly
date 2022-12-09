<script lang="typescript">
    import { localize } from '@core/i18n'
    import { ExpirationTime } from '@core/utils'
    import { newTransactionDetails, updateNewTransactionDetails } from '@core/wallet'
    import { Button, HR } from 'shared/components'
    import { sendRouter } from '../../../../../lib/routers'

    export let onCancel: () => unknown = () => {}

    const DATE_NOW = Date.now()

    const dateIn1Hour = new Date(DATE_NOW)
    dateIn1Hour.setTime(dateIn1Hour.getTime() + 1 * 60 * 60 * 1000)

    const dateIn1Day = new Date(DATE_NOW)
    dateIn1Day.setDate(dateIn1Day.getDate() + 1)

    const dateIn1Week = new Date(DATE_NOW)
    dateIn1Week.setDate(dateIn1Week.getDate() + 7)

    function handleChooseExpirationTimeClick(_expiration: ExpirationTime): void {
        let expirationDate: Date
        switch (_expiration) {
            case ExpirationTime.OneHour:
                expirationDate = dateIn1Hour
                break
            case ExpirationTime.OneDay:
                expirationDate = dateIn1Day
                break
            case ExpirationTime.OneWeek:
                expirationDate = dateIn1Week
                break
            case ExpirationTime.None:
                expirationDate = null
                break
            case ExpirationTime.Custom:
            default:
                break
        }
        updateNewTransactionDetails({ type: $newTransactionDetails.type, expirationDate })
        $sendRouter.next()
    }
</script>

<div class="w-full flex flex-col space-y-4">
    <Button outline onClick={() => handleChooseExpirationTimeClick(ExpirationTime.None)} classes="w-full">
        {localize('menus.expirationTimePicker.none')}
    </Button>
    <Button outline onClick={() => handleChooseExpirationTimeClick(ExpirationTime.OneHour)} classes="w-full">
        {localize('menus.expirationTimePicker.1hour')}
    </Button>
    <Button outline onClick={() => handleChooseExpirationTimeClick(ExpirationTime.OneDay)} classes="w-full">
        {localize('menus.expirationTimePicker.1day')}
    </Button>
    <Button outline onClick={() => handleChooseExpirationTimeClick(ExpirationTime.OneWeek)} classes="w-full">
        {localize('menus.expirationTimePicker.1week')}
    </Button>
    <HR />
    <Button outline onClick={onCancel} classes="w-full">
        {localize('actions.cancel')}
    </Button>
</div>
