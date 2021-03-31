<script lang="typescript">
    import { Icon } from 'shared/components'
    import { closePopup } from 'shared/lib/popup'
    import { onMount } from 'svelte'
    import { fade } from 'svelte/transition'
    import AddNode from './AddNode.svelte'
    import AddressHistory from './AddressHistory.svelte'
    import Backup from './Backup.svelte'
    import Busy from './Busy.svelte'
    import DeleteAccount from './DeleteAccount.svelte'
    import DeleteProfile from './DeleteProfile.svelte'
    import Diagnostics from './Diagnostics.svelte'
    import ErrorLog from './ErrorLog.svelte'
    import Password from './Password.svelte'
    import QR from './QR.svelte'
    import RemoveNode from './RemoveNode.svelte'
    import Version from './Version.svelte'

    export let locale = 'en'
    export let type = undefined
    export let props = undefined
    export let hideClose = undefined
    export let fullScreen = undefined
    export let transition = true

    let popupContent

    const types = {
        qr: QR,
        password: Password,
        version: Version,
        backup: Backup,
        deleteAccount: DeleteAccount,
        addressHistory: AddressHistory,
        addNode: AddNode,
        removeNode: RemoveNode,
        busy: Busy,
        errorLog: ErrorLog,
        deleteProfile: DeleteProfile,
        diagnostics: Diagnostics,
    }

    const onkey = (e) => {
        if (!hideClose && e.key === 'Escape') {
            if ('function' === typeof props?.onCancelled) {
                props?.onCancelled()
            }
            closePopup()
        }
    }

    const focusableElements = () =>
        [...popupContent.querySelectorAll('a, button, input, textarea, select, details,[tabindex]:not([tabindex="-1"])')].filter(
            (el) => !el.hasAttribute('disabled')
        )

    const handleFocusFirst = (e) => {
        const elems = focusableElements()
        if (elems && elems.length > 0) {
            elems[elems.length - 1].focus()
        }
        e.preventDefault()
    }
    const handleFocusLast = (e) => {
        const elems = focusableElements()
        if (elems && elems.length > 0) {
            elems[0].focus()
        }
        e.preventDefault()
    }

    onMount(() => {
        const elems = focusableElements()
        if (elems && elems.length > 0) {
            elems[hideClose || elems.length === 1 ? 0 : 1].focus()
        }
    })
</script>

<style type="text/scss">
    popup {
        popup-content {
            box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.25);
            width: 100%;
            max-width: 480px;

            &.full-screen {
                box-shadow: none;
            }
        }
    }
</style>

<svelte:window on:keydown={onkey} />
<popup
    in:fade={{ duration: transition ? 100 : 0 }}
    class={`flex items-center justify-center fixed top-0 left-0 w-screen p-6
                h-full overflow-hidden z-10 ${fullScreen ? 'bg-white dark:bg-gray-900' : 'bg-gray-800 bg-opacity-40'}`}>
    <div tabindex="0" on:focus={handleFocusFirst} />
    <popup-content
        bind:this={popupContent}
        class={`bg-white rounded-xl pt-6 px-8 pb-8 relative ${fullScreen ? 'full-screen dark:bg-gray-900' : 'dark:bg-gray-900'}`}>
        {#if !hideClose}
            <button on:click={closePopup} class="absolute top-6 right-8 text-gray-800 dark:text-white focus:text-blue-500">
                <Icon icon="close" />
            </button>
        {/if}
        <svelte:component this={types[type]} {...props} {locale} />
    </popup-content>
    <div tabindex="0" on:focus={handleFocusLast} />
</popup>
