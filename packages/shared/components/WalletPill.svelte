<script lang="typescript">
    import { Text, Tooltip } from 'shared/components'
    import { getInitials } from 'shared/lib/helpers'
    import { localize } from 'shared/lib/i18n'
    import { AccountPatterns } from 'shared/lib/wallet'
    import { isBright } from 'shared/lib/helpers'

    export let name: string = ''
    export let color = ''
    export let pattern: AccountPatterns = AccountPatterns.Default
    export let size: 's' | 'm' = 'm'
    export let active: boolean = false
    export let onClick: () => void = () => {}
    export let enableTooltip = false
    export let tooltipPosition: 'top' | 'bottom' | 'left' | 'right' = 'top'
    export let classes: string = ''

    let showTooltip = false
    let tooltipAnchor

    const toggleTooltip = (): void => {
        showTooltip = !showTooltip
    }

    $: textColor = isBright(color) ? 'gray-800' : 'white'
</script>

<style type="text/scss">
    button {
        &.disabled-hover {
                background-color: var(--account-color);

                &.bg-blend-exclusion {
                    background-blend-mode: exclusion;
                }
            }
        &:not(.disabled-hover):hover {
            background-color: var(--account-color);

            &.bg-blend-exclusion {
                background-blend-mode: exclusion;
            }
        }
    }
</style>

<button
    on:click={onClick}
    on:mouseenter={toggleTooltip}
    on:mouseleave={toggleTooltip}
    bind:this={tooltipAnchor}
    class:bg-blend-exclusion={isBright(color)}
    style="--account-color: {color}; {pattern ? `background-image: url("assets/patterns/${pattern}-gradient.svg")` : null}"
    class="{size === 'm' ? 'w-10 h-10 rounded-xl p-2 text-14' : 'w-8 h-8 rounded-lg p-1 text-12'} leading-100 font-bold text-center
            {active ? `disabled-hover text-${textColor}` : 'bg-gray-200 dark:bg-gray-700 text-gray-500'} bg-no-repeat bg-right-top
            bg-cover hover:text-{textColor} {classes}">{getInitials(name, 2)}
</button>

{#if enableTooltip && showTooltip}
    <Tooltip anchor={tooltipAnchor} position={tooltipPosition}>
        <Text type="p" classes="text-gray-900 bold text-center">
            {localize('general.staking')}: {name}
        </Text>
    </Tooltip>
{/if}
