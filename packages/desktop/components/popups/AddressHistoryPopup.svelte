<script lang="ts">
    import { getSelectedAccount } from '@core/account'
    import { localize } from '@core/i18n'
    import { setClipboard, truncateString } from '@core/utils'
    import { AccountAddress } from '@iota/sdk/out/types'
    import VirtualList from '@sveltejs/svelte-virtual-list'
    import { FontWeight, KeyValueBox, Spinner, Text, TextType } from 'shared/components'
    import { onMount } from 'svelte'
    import { Icon } from '@ui'
    import { Icon as IconEnum } from '@auxiliary/icon'

    let addressList: AccountAddress[] | undefined = undefined

    function onCopyClick(): void {
        const addresses = addressList.map((address) => address.address).join(',')
        setClipboard(addresses)
    }

    onMount(() => {
        getSelectedAccount()
            ?.addresses()
            .then((_addressList) => {
                addressList = _addressList?.sort((a, b) => a.keyIndex - b.keyIndex) ?? []
            })
            .catch((err) => {
                console.error(err)
                addressList = []
            })
    })
</script>

<div class="flex flex-col space-y-6">
    <Text type={TextType.h3} fontWeight={FontWeight.semibold} lineHeight="6">
        {localize('popups.addressHistory.title')}
    </Text>
    <div class="flex w-full items-center justify-between">
        <Text fontSize="15" color="gray-700" classes="text-left">{localize('popups.addressHistory.disclaimer')}</Text>
        <button on:click={onCopyClick} class="text-gray-500 dark:text-gray-100 p2" type="button">
            <Icon icon={IconEnum.Copy} />
        </button>
    </div>
    {#if addressList}
        {#if addressList.length > 0}
            <div class="w-full flex-col space-y-2 virtual-list-wrapper">
                <VirtualList items={addressList} let:item>
                    <div class="mb-1">
                        <KeyValueBox
                            isCopyable
                            classes="flex items-center w-full py-4"
                            keyText={truncateString(item?.address, 15, 15)}
                            valueText={localize('popups.addressHistory.indexAndType', {
                                values: {
                                    index: item.keyIndex,
                                    internal: item.internal,
                                },
                            })}
                            copyValue={item.address}
                            backgroundColor="gray-50"
                            darkBackgroundColor="gray-900"
                        />
                    </div>
                </VirtualList>
            </div>
        {:else}
            <Text secondary classes="text-center">-</Text>
        {/if}
    {:else}
        <div class="flex items-center justify-center">
            <Spinner />
        </div>
    {/if}
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
