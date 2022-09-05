<script lang="typescript">
    import { Text, ExpirationTimePickerMenu, Icon } from 'shared/components'
    import { formatDate, localize } from '@core/i18n'
    import { ExpirationTime } from 'components/modals/ExpirationTimePickerMenu.svelte'

    export let value: Date
    export let initialSelected: ExpirationTime = ExpirationTime.None
    export let disabled: boolean = false

    let menu: ExpirationTimePickerMenu
    let anchor: HTMLElement
    let selected: ExpirationTime

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
