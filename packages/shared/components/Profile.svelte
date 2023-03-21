<script lang="typescript">
    import { Chip, Icon, Text, StrongholdWarningBadge } from 'shared/components'
    import { getInitials as _getInitials } from 'shared/lib/helpers'
    import { localize } from '@core/i18n'

    export let classes = undefined

    export let name = ''
    export let id = ''
    export let isDeveloper = false
    export let isLedgerProfile = false
    export let isStrongholdOutdated = false
    export let bgColor: string

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
    <div class="flex flex-col justify-between items-center space-y-3">
        <div class="relative flex flex-col">
            <div
                on:click={() => handleOnClick()}
                class="h-20 w-20 {bgColor
                    ? `bg-${bgColor}-500`
                    : ''} rounded-full font-bold text-center flex items-center justify-center {classes}"
            >
                {#if slots}
                    <slot />
                {:else}
                    <Text type="h3" classes="text-white">{getInitials()}</Text>
                {/if}
            </div>
            {#if isStrongholdOutdated}
                <StrongholdWarningBadge />
            {/if}
        </div>
        <div class="flex flex-row items-baseline space-x-1.5">
            {#if isLedgerProfile}
                <Icon
                    icon="ledger"
                    classes="text-gray-400 dark:text-gray-700 relative top-0.5"
                    width={14}
                    height={14}
                />
            {/if}
            <Text type="h5" classes="text-center">{name}</Text>
        </div>
        {#if isDeveloper}
            <Chip label={localize('general.dev')} />
        {/if}
    </div>
</div>
