<script lang="typescript">
    import { getContext } from 'svelte'
    import { fade } from 'svelte/transition'
    import QR from './QR.svelte'
    import Password from './Password.svelte'
    import Version from './Version.svelte'
    import Backup from './Backup.svelte'
    import DeleteAccount from './DeleteAccount.svelte'
    import AddressHistory from './AddressHistory.svelte'
    import { Icon } from 'shared/components'

    export let locale = 'en'
    export let type = undefined
    export let props = undefined

    const state = getContext('popupState')

    const types = {
        qr: QR,
        password: Password,
        version: Version,
        backup: Backup,
        deleteAccount: DeleteAccount,
        addressHistory: AddressHistory,
    }

    const onkey = (e) => {
        if (e.key === 'Escape') {
            close()
        }
    }

    const close = () => {
        state.set({ active: false })
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
    <popup-content class="bg-white dark:bg-gray-900 rounded-xl pt-6 px-8 pb-14 relative">
        <button on:click={close} class="absolute top-6 right-8">
            <Icon icon="close" classes="text-gray-800 dark:text-white" />
        </button>
        <svelte:component this={types[type]} {...props} {locale} />
    </popup-content>
</popup>
