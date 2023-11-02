<script lang="ts">
    import VirtualList from '@sveltejs/svelte-virtual-list'
    import { localize } from '@core/i18n'
    import { FontWeight, KeyValueBox, Spinner, Text, TextType } from 'shared/components'
    import { getSelectedAccount } from '@core/account'
    import { truncateString } from '@core/utils'
</script>

<div class="flex flex-col space-y-6">
    <Text type={TextType.h3} fontWeight={FontWeight.semibold} lineHeight="6">
        {localize('Address History')}
    </Text>

    {#await getSelectedAccount()?.addresses()}
        <div class="flex">
            <Spinner message="Loading addresses..." />
        </div>
    {:then accountAddresses}
        {#if accountAddresses && accountAddresses?.length > 0}
            <div class="w-full flex-col space-y-2 virtual-list-wrapper">
                <VirtualList items={accountAddresses} let:item>
                    <div class="mb-1">
                        <KeyValueBox
                            isCopyable
                            classes="flex items-center w-full py-4"
                            keyText={item.keyIndex.toString()}
                            valueText={truncateString(item?.address, 16, 16)}
                            copyValue={item.address}
                            backgroundColor="gray-50"
                            darkBackgroundColor="gray-900"
                        />
                    </div>
                </VirtualList>
            </div>
        {:else}
            <div class="flex justify-center">Empty</div>
        {/if}
    {/await}
</div>

<style lang="scss">
    .virtual-list-wrapper :global(svelte-virtual-list-viewport) {
        margin-right: -1rem !important;
        flex: auto;
        overflow-y: scroll;
        padding-right: 1.5rem !important;
        min-height: 52px;
        max-height: 300px;
    }

    .virtual-list-wrapper :global(svelte-virtual-list-contents) {
        margin-right: -1rem !important;
    }
</style>
