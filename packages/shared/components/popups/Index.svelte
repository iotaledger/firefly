<script lang="typescript">
    import { fade } from 'svelte/transition'
    import { Icon } from 'shared/components'
    import { closePopup } from 'shared/lib/popup'
    import QR from './QR.svelte'
    import Password from './Password.svelte'
    import Version from './Version.svelte'
    import Backup from './Backup.svelte'
    import DeleteAccount from './DeleteAccount.svelte'
    import AddressHistory from './AddressHistory.svelte'
    import AddNode from './AddNode.svelte'
    import Busy from './Busy.svelte'
    import ErrorLog from './ErrorLog.svelte'

    export let locale = 'en'
    export let type = undefined
    export let props = undefined
    export let hideClose = undefined

    const types = {
        qr: QR,
        password: Password,
        version: Version,
        backup: Backup,
        deleteAccount: DeleteAccount,
        addressHistory: AddressHistory,
        addNode: AddNode,
        busy: Busy,
        errorLog: ErrorLog
    }

    const onkey = (e) => {
        if (!hideClose && e.key === 'Escape') {
            closePopup()
        }
    }
</script>

<style type="text/scss">
    popup {
        popup-content {
            box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.25);
            width: 100%;
            max-width: 480px;
        }
    }
</style>

<svelte:window on:keydown={onkey} />
<popup
    in:fade={{ duration: 100 }}
    class="flex items-center justify-center fixed top-0 left-0 w-screen p-6
                h-screen overflow-hidden z-10 bg-gray-800 bg-opacity-40">
    <popup-content class="bg-white dark:bg-gray-900 rounded-xl pt-6 px-8 pb-8 relative">
        {#if !hideClose}
            <button on:click={closePopup} class="absolute top-6 right-8">
                <Icon icon="close" classes="text-gray-800 dark:text-white" />
            </button>
        {/if}
        <svelte:component this={types[type]} {...props} {locale} />
    </popup-content>
</popup>
