<script lang="typescript">
    import { getContext } from 'svelte'
    import { fade } from 'svelte/transition'
    import { date } from 'svelte-i18n'
    import QR from './QR.svelte'
    import Password from './Password.svelte'
    import Update from './Version.svelte'
    import Backup from './Backup.svelte'
    import { Text, Icon } from 'shared/components'
    import { closePopup, popupState } from 'shared/lib/popup'

    export let locale = 'en'
    export let type = undefined
    export let props = undefined

    const types = {
        qr: QR,
        password: Password,
        update: Update,
        backup: Backup,
    }

    const headings = {
        qr: {
            title: locale('popups.password.title'),
        },
        password: {
            title: locale('popups.password.title'),
            subtitle: locale('popups.password.subtitle'),
        },
        update: {
            title: locale('popups.version.title', { values: { version: $popupState.props.currentVersion } }),
        },
        backup: {
            title: $popupState.props.lastBackupDate
                ? locale('popups.backup.title', { values: { date: $date($popupState.props.lastBackupDate, { format: 'long' }) } })
                : locale('popups.backup.not_backed_up'),
        },
    }

    $: title = headings[type]?.title
    $: subtitle = headings[type]?.subtitle

    const onkey = (e) => {
        if (e.key === 'Escape') {
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
{#key type}
    <popup
        in:fade={{ duration: 100 }}
        class="flex items-center justify-center fixed top-0 left-0 w-screen p-6
                    h-screen overflow-hidden z-10 bg-gray-800 bg-opacity-40">
        <popup-content class="bg-white dark:bg-gray-900 rounded-xl pt-6 px-8 pb-14">
            <div class="w-full mb-10 flex flex-row justify-between items-start">
                <div>
                    {#if title}
                        <Text type="h4">{title}</Text>
                    {/if}
                    {#if subtitle}
                        <Text type="p" secondary>{subtitle}</Text>
                    {/if}
                </div>
                <button on:click={closePopup}>
                    <Icon icon="close" classes="text-gray-800 dark:text-white" />
                </button>
            </div>
            <svelte:component this={types[type]} {...props} {locale} />
        </popup-content>
    </popup>
{/key}
