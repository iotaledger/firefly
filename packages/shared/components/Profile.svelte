<script lang="typescript">
    import { Icon, Text } from 'shared/components'
    import { getInitials as _getInitials } from 'shared/lib/helpers'

    export let classes = undefined
    export let locale

    export let name = ''
    export let id = ''
    export let isDeveloper = false
    export let isLedgerProfile = false
    export let onClick = () => ''
    export let bgColor

    let slots = $$props.$$slots

    function getInitials() {
        const initials = _getInitials(name)
        if (initials.length === 1) {
            return initials
        } else {
            const letters = initials.split('')
            return letters[0] + letters[letters.length - 1]
        }
    }
</script>

<div class="flex items-center justify-center w-24">
    <div class="flex flex-col justify-between items-center">
        <div
            on:click={() => onClick(id)}
            class="h-20 w-20 {bgColor ? `bg-${bgColor}-500` : ''} rounded-full font-bold text-center flex items-center justify-center {classes}">
            {#if slots}
                <slot />
            {:else}
                <Text type="h3" classes="text-white">{getInitials()}</Text>
            {/if}
        </div>
        <div class="mt-5 flex flex-row items-baseline space-x-1.5">
            {#if isLedgerProfile}
                <Icon icon="ledger" classes="text-gray-400 dark:text-gray-700 relative top-0.5" width={14} height={14} />
            {/if}
            <Text type="h5" classes="text-center">{name}</Text>
        </div>
        {#if isDeveloper}
            <div class="bg-gray-500 dark:bg-gray-700 dark:bg-opacity-20 rounded-full px-2 py-1 mt-4">
                <Text type="p" smaller classes="text-white">{locale('general.dev').toUpperCase()}</Text>
            </div>
        {/if}
    </div>
</div>
