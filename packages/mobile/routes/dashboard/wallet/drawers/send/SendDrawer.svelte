<script lang="typescript">
    import { localize } from '@core/i18n'
    import { resetNewTransactionDetails } from '@core/wallet'
    import { Drawer } from '../../../../../components'
    import { sendRoute, SendRoute, sendRouter } from '../../../../../lib/core/router'
    import { Recipient, Token } from './views'

    export let onClose: () => unknown = () => {}

    let title: string
    let allowBack: boolean
    let fullScreen: boolean

    $: $sendRoute, (setTitle(), setAllowBack(), setFullScreen())

    function onDrawerClose(): void {
        onClose && onClose()
        $sendRouter.reset()
        resetNewTransactionDetails()
    }
    function setTitle(): void {
        switch ($sendRoute) {
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

<Drawer onClose={onDrawerClose} {title} {fullScreen} {allowBack} onBackClick={() => $sendRouter.previous()}>
    {#if $sendRoute === SendRoute.Token}
        <Token />
    {:else if $sendRoute === SendRoute.Recipient}
        <Recipient />
    {/if}
</Drawer>
