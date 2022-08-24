<script lang="typescript">
    import { Text, ExpirationTimePickerMenu, Icon } from 'shared/components'
    import { formatDate, localize } from '@core/i18n'

    export let value: Date
    export let initialSelected: 'none' | '1hour' | '1day' | '1week' = 'none'
    export let disabled

    let menu: ExpirationTimePickerMenu
    let anchor: HTMLElement
    let selected: 'none' | '1hour' | '1day' | '1week'

    $: selected = initialSelected
</script>

<button
    class="flex items-center justify-center {disabled ? 'cursor-default' : 'cursor-pointer'}"
    {disabled}
    on:click={menu?.tryOpen}
    bind:this={anchor}
>
    <div class="flex flex-row hover:text-blue-600">
        <Text
            highlighted={!disabled}
            color="gray-600"
            darkColor="gray-500"
            classes={disabled ? '' : 'hover:text-blue-600'}
        >
            {value
                ? formatDate(value, {
                      dateStyle: 'long',
                      timeStyle: 'medium',
                  })
                : localize('general.none')}
        </Text>
        {#if !disabled}
            <Icon icon="chevron-down" width="10" classes="text-blue-500 ml-1" />
        {/if}
    </div>
</button>
<ExpirationTimePickerMenu bind:this={menu} bind:value bind:selected bind:anchor />
