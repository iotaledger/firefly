<script lang="typescript">
    import { selectedAccount } from '@core/account'
    import { localize } from '@core/i18n'
    import { Drawer } from '../../../../components'
    import { sendRoute, SendRoute, sendRouter } from '../../../../lib/routers'
    import SendRouter from './SendRouter.svelte'

    export let onClose: () => unknown = () => {}

    let title: string
    let allowBack: boolean
    let fullScreen: boolean

    $: $sendRoute, (setTitle(), setAllowBack(), setFullScreen())

    function setTitle(): void {
        switch ($sendRoute) {
            case SendRoute.Reference:
                title = localize('actions.addReference')
                break
            case SendRoute.Expiration:
                title = localize('general.expirationTime')
                break
            default:
                title = localize('popups.sendForm.title')
                break
        }
    }
    function setAllowBack(): void {
        switch ($sendRoute) {
            case SendRoute.Token:
                allowBack = false
                break
            default:
                allowBack = true
                break
        }
    }
    function setFullScreen(): void {
        switch ($sendRoute) {
            case SendRoute.Unit:
            case SendRoute.Expiration:
            case SendRoute.CustomExpiration:
            case SendRoute.Password:
                fullScreen = false
                break
            default:
                fullScreen = true
                break
        }
    }
</script>

<Drawer
    {onClose}
    {title}
    {fullScreen}
    allowBack={!$selectedAccount.isTransferring && allowBack}
    onBackClick={() => $sendRouter.previous()}
>
    <SendRouter />
</Drawer>
