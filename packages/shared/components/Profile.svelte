<script lang="typescript">
    import { localize } from '@core/i18n'
    import { Chip, Icon, Text, WarningBadge } from 'shared/components'
    import { getInitials as _getInitials } from 'shared/lib/helpers'

    export let classes = undefined

    export let name = ''
    export let id = ''
    export let isDeveloper = false
    export let isLedgerProfile = false
    export let bgColor: string
    export let strongholdUpdateRequired: boolean = false

    export let onClick: undefined | ((id: string) => void) = undefined

    function handleOnClick() {
        onClick && onClick(id)
    }

    const slots = $$props.$$slots

    function getInitials() {
        const initials = _getInitials(name, 1)
        if (initials.length === 1) {
            return initials
        } else {
            const letters = initials.split('')
            return letters[0] + letters[letters.length - 1]
        }
    }
</script>

<div class="flex items-center justify-center w-24">
    <div class="flex flex-col justify-between items-center space-y-3 w-full">
        <div
            on:click={() => handleOnClick()}
            class="relative h-20 w-20 {bgColor
                ? `bg-${bgColor}-500`
                : ''} rounded-full font-bold text-center flex items-center justify-center {classes}"
        >
            {#if slots}
                <slot />
            {:else}
                <Text type="h3" classes="text-white">{getInitials()}</Text>
            {/if}
            {#if strongholdUpdateRequired}
                <WarningBadge />
            {/if}
        </div>
        <div class="flex flex-row items-baseline justify-center space-x-1.5 w-full">
            {#if isLedgerProfile}
                <Icon
                    icon="ledger"
                    classes="text-gray-400 dark:text-gray-700 relative top-0.5"
                    width={14}
                    height={14}
                />
            {/if}
            <Text type="h5" classes="text-center truncate">{name}</Text>
        </div>
        {#if isDeveloper}
            <Chip label={localize('general.dev')} />
        {/if}
    </div>
</div>
