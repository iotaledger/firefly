<script lang="ts">
    import { Locale } from '@core/i18n'

    import { Unit } from '@iota/unit-converter'

    import { fade } from 'svelte/transition'

    import { default as ConfirmTransfer } from '../../../../components/drawerContent/ConfirmTransfer.svelte'
    import { default as Password } from '../../../../components/drawerContent/Password.svelte'

    import { default as Send } from './Send.svelte'

    export let locale: Locale
    export let onSend = (..._: any[]): void => {}
    export let onInternalTransfer = (..._: any[]): void => {}
    export let onComplete = (): void => {}
    export let fadeContent = false

    const [sat] = getComputedStyle(document.documentElement).getPropertyValue('--sat').split('px')

    const height = `${window.innerHeight - parseInt(sat) - 10}px`

    let state: 'SEND' | 'CONFIRM' | 'PASSWORD' = 'SEND'

    let _accountId: string = undefined
    let _internal: boolean = false
    let _amount: number = undefined
    let _unit: Unit.i = undefined
    let _to: string = undefined
    let _onSuccess: () => void
    let _onConfirm: (internal: boolean) => void

    export function passwordRequired(onSuccess: () => void): void {
        _onSuccess = onSuccess
        state = 'PASSWORD'
        fadeAnimation()
    }

    function fadeAnimation() {
        fadeContent = false
        setTimeout(() => {
            fadeContent = true
        })
    }
    function confirmWithoutPopup(accountId, internal, amount, unit, to, onConfirm): void {
        _accountId = accountId
        _internal = internal
        _amount = amount
        _unit = unit
        _to = to
        _onConfirm = onConfirm
        state = 'CONFIRM'
        fadeAnimation()
    }

    function handleBackButton() {
        fadeAnimation()
        switch (state) {
            case 'CONFIRM':
                state = 'SEND'
                break
            case 'PASSWORD':
                state = 'CONFIRM'
                break
        }
    }
</script>

<div class="grid" style="height: {height}">
    {#if state === 'SEND'}
        <div class="send" in:fade={{ duration: 400 }} out:fade={{ duration: 200 }}>
            <Send {onSend} {onInternalTransfer} {fadeContent} {confirmWithoutPopup} />
        </div>
    {/if}
    {#if state === 'CONFIRM'}
        <div class="confirm" in:fade={{ duration: 400 }} out:fade={{ duration: 200 }}>
            <ConfirmTransfer
                accountId={_accountId}
                internal={_internal}
                amount={_amount}
                unit={_unit}
                to={_to}
                onConfirm={_onConfirm}
                {fadeContent}
                {handleBackButton}
                {onComplete}
            />
        </div>
    {/if}
    {#if state === 'PASSWORD'}
        <div class="confirm" in:fade={{ duration: 400 }} out:fade={{ duration: 200 }}>
            <Password {locale} onSuccess={_onSuccess} {handleBackButton} />
        </div>
    {/if}
</div>

<style>
    :root {
        --sat: env(safe-area-inset-top);
    }

    .send {
        grid-column: 1;
        grid-row: 1;
    }

    .confirm {
        grid-column: 1;
        grid-row: 1;
    }
</style>
