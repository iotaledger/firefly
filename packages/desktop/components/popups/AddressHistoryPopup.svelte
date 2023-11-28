<script lang="ts">
    import { onMount } from 'svelte'
    import { getProfileManager } from '@core/profile-manager/stores'
    import { checkActiveProfileAuth, getActiveProfile } from '@core/profile'
    import { fetchWithTimeout } from '@core/nfts'
    import { CHRONICLE_URLS } from '@core/network/constants/chronicle-urls.constant'
    import { getSelectedAccount } from '@core/account'
    import {
        Button,
        FontWeight,
        KeyValueBox,
        Text,
        TextType,
        Spinner,
    } from 'shared/components'
    import VirtualList from '@sveltejs/svelte-virtual-list'
    import { AccountAddress } from '@iota/sdk/out/types'
    import { closePopup } from '@auxiliary/popup/actions/closePopup'
    import { localize } from '@core/i18n'
    import { truncateString } from '@core/utils'

    interface AddressHistory {
        address: string,
        items: [{
            milestoneIndex: number,
            milestoneTimestamp: number,
            outputId: string,
            isSpent: boolean
        }]
    }

    const CHRONICLE_ROUTE = 'api/explorer/v2/ledger/updates/by-address/'

    const account = getSelectedAccount()
    const accountIndex = account.index
    const network = getActiveProfile().network.id;
    const chronicleEndpoints = CHRONICLE_URLS[network];
    // TODO Care with the 0
    const chronicleRoot = chronicleEndpoints[0]
    const baseURL = `${chronicleRoot}${CHRONICLE_ROUTE}`

    let knownAddresses: AccountAddress[] | undefined = undefined

    let addressSearchIndex = 0
    const foundAddresses: string[] = []
    const isBusy = false

    $: console.log('Network', network);
    $: console.log('Chronicle', chronicleRoot);
    $: console.log('Known addresses are:', knownAddresses);

    onMount(() => {
        getSelectedAccount()
            ?.addresses()
            .then((_addressList) => {
                knownAddresses = _addressList?.sort((a, b) => a.keyIndex - b.keyIndex) ?? []
            })
            .catch((err) => {
                console.error(err)
                knownAddresses = []
            })
    })

    async function isAddressWithHistory(address: string): Promise<boolean> {
        try {
            const response = await fetchWithTimeout(`${baseURL}${address}`, 3, { method: 'GET' });
            const addressHistory: AddressHistory = await response.json()
            return addressHistory?.items?.length > 0
        } catch (err) {
            console.error(err)
            return false;
        }
    }

    const GENERATE_STEP = 10
    async function generateAddresses(): Promise<string[]> {
        console.debug('Generating...')
        let generatedCount = 0;
        const generatedAddresses = [];
        while (generatedCount < GENERATE_STEP) {
            const address = await getProfileManager().generateEd25519Address(
                accountIndex,
                addressSearchIndex
            )

            addressSearchIndex++

            if (knownAddresses.map(accountAddress => accountAddress.address).includes(address)) {
                continue
            }

            generatedAddresses.push(address)
            generatedCount++
        }

        return generatedAddresses
    }

    async function search(): Promise<void> {
        const isUnlocked = await unlock
        if (isUnlocked) {
            const nextAddressesToCheck = await generateAddresses()
            console.debug('Generated addresses:', nextAddressesToCheck)

            for (const addressToCheck of nextAddressesToCheck) {
                const hasHistory = await isAddressWithHistory(addressToCheck)
                if (hasHistory) {
                    foundAddresses.push(addressToCheck)
                }
            }

            console.debug('Found addresses', foundAddresses)
        }
    }

    const unlock = new Promise<boolean>((resolve) => {
        const onSuccess: () => Promise<void> = () => {
            resolve(true)
            return Promise.resolve()
        }
        const onCancel: () => void = () => resolve(false)
        const config = { stronghold: true, ledger: true }
        checkActiveProfileAuth(onSuccess, config, onCancel)
    })

    function onCancelClick(): void {
        closePopup()
    }
</script>

<div class="flex flex-col space-y-6">
    <Text type={TextType.h3} fontWeight={FontWeight.semibold} lineHeight="6">
        {localize('popups.addressHistory.title')}
    </Text>
    <Text fontSize="15" color="gray-700" classes="text-left">{localize('popups.addressHistory.disclaimer')}</Text>
    {#if knownAddresses}
        {#if knownAddresses.length > 0}
            <div class="w-full flex-col space-y-2 virtual-list-wrapper">
                <VirtualList items={knownAddresses} let:item>
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
<div class="flex flex-row flex-nowrap w-full space-x-4 mt-6">
    <Button classes="w-full" outline onClick={onCancelClick} disabled={isBusy}>
        {localize('actions.cancel')}
    </Button>
    <Button
        classes="w-full"
        onClick={search}
        disabled={isBusy}
        {isBusy}
        busyMessage={localize('actions.searching')}
    >
        {localize('actions.search')}
    </Button>
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
