<script lang="ts">
    import { Icon } from '@ui'
    import { localize } from '@core/i18n'
    import { debounce } from '@core/utils'
    import { Icon as IconEnum } from '@lib/auxiliary/icon'

    export let value: string

    let searchValue = ''

    $: debounce(() => {
        value = searchValue
    })()
</script>

<input-container class="flex items-center py-2 px-4 rounded-lg bg-gray-50 dark:bg-gray-850">
    <Icon icon={IconEnum.Search} classes="mr-2 text-gray-500 dark:text-white" width={21} height={21} />
    <input
        bind:value={searchValue}
        placeholder={localize('general.search')}
        type="text"
        class="flex-1 text-sm bg-transparent text-gray-500 dark:text-white"
    />
    {#if searchValue}
        <button on:click={() => (searchValue = '')} slot="right">
            <Icon
                icon={IconEnum.Close}
                classes="cursor-pointer ml-2 text-gray-500 dark:text-white hover:text-gray-600 dark:hover:text-gray-200"
                width={21}
                height={21}
            />
        </button>
    {/if}
</input-container>
