<script lang="typescript">
    import { formatDate, localize } from '@core/i18n'
    import { Icon, Text } from 'shared/components'

    export let value: Date = undefined
    export let disabled: boolean = false
    export let onClick: () => unknown = () => {}
</script>

<button
    class="flex items-center justify-center {disabled ? 'cursor-default' : 'cursor-pointer'}"
    {disabled}
    on:click={onClick}
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
