<script lang="ts">
    import { Text, Icon } from 'shared/components'
    import { Icon as IconEnum } from '@auxiliary/icon'
    import { formatDate, localize } from '@core/i18n'
    import { TimePeriod } from '@core/utils'
    import DateTimePickerMenu from './DateTimePickerMenu.svelte'

    export let value: Date = undefined
    export let selected: TimePeriod = TimePeriod.None
    export let disabled: boolean = false

    let menu: DateTimePickerMenu
    let anchor: HTMLElement = undefined
    let storedValue: Date

    export function setNull(bool: boolean): void {
        if (bool) {
            storedValue = value
            value = null
        } else {
            value = storedValue ?? value
        }
    }
</script>

<button
    class="flex items-center justify-center {disabled ? 'cursor-default' : 'cursor-pointer'}"
    {disabled}
    on:click={menu?.tryOpen}
    bind:this={anchor}
>
    <div class="flex flex-row hover:text-blue-600 items-center">
        <Text
            highlighted={!disabled}
            color="gray-600"
            darkColor="gray-500"
            classes={disabled ? '' : 'hover:text-blue-600'}
        >
            {value ? formatDate(value, { dateStyle: 'long', timeStyle: 'medium' }) : localize('general.none')}
        </Text>
        {#if !disabled}
            <Icon icon={IconEnum.ChevronDown} width="10" height="13" classes="text-blue-500 ml-1" />
        {/if}
    </div>
</button>
<DateTimePickerMenu bind:this={menu} bind:value bind:selected bind:anchor />
