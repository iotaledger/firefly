<script lang="typescript">
    import AccountCreation from 'shared/components/AccountCreation.svelte'
    import { closePopup, popupState } from 'shared/lib/popup'

    export let onAccountCreation = (..._: any[]): void => {}

    let isBusy

    $: {
        /**
         * CAUTION: isBusy becomes true whenever the Stronghold password popup
         * becomes active (by Wallet.svelte), so we must be sure that it gets
         * set to false again in case the user cancels the popup. This is safe
         * because it's within a reactive dependency.
         */
        if (!$popupState.active) {
            isBusy = false
        }
    }
</script>

<AccountCreation onCancel={() => closePopup()} {isBusy} {onAccountCreation} />
