<script lang="ts">
    import { Text, ExpirationTimePickerMenu, Icon } from 'shared/components'
    import { Icon as IconEnum } from '@auxiliary/icon'
    import { formatDate, localize } from '@core/i18n'
    import { TimePeriod } from '@core/utils'

    export let value: Date | null = null
    export let initialSelected: TimePeriod = TimePeriod.None
    export let disabled: boolean = false

    let menu: ExpirationTimePickerMenu
    let anchor: HTMLElement | undefined = undefined
    let selected: TimePeriod
    let storedValue: Date

    $: selected = initialSelected

    export function setNull(bool: boolean): void {
        if (bool && value) {
            storedValue = value
            value = null
        } else {
            value = storedValue ?? value
        }
    }
</script>

<button {disabled} on:click={menu?.tryOpen} bind:this={anchor}>
    <div class="flex flex-row hover:text-blue-600">
        <Text
            highlighted={!disabled}
            color="gray-600"
            darkColor="gray-500"
            classes={disabled ? '' : 'hover:text-blue-600'}
        >
            {value ? formatDate(value, { dateStyle: 'long', timeStyle: 'medium' }) : localize('general.none')}
        </Text>
        {#if !disabled}
            <Icon icon={IconEnum.ChevronDown} width="10" classes="text-blue-500 ml-1" />
        {/if}
    </div>
</button>
<ExpirationTimePickerMenu bind:this={menu} bind:value bind:selected bind:anchor />

<style lang="scss">
    button {
        @apply flex items-center justify-center;
    }
</style>
