<script lang="ts">
    import { onMount } from 'svelte'
    import { getProfileManager } from '@core/profile-manager/stores'
    import { checkActiveProfileAuth, getActiveProfile, updateAccountPersistedDataOnActiveProfile } from '@core/profile'
    import { fetchWithTimeout } from '@core/nfts'
    import { CHRONICLE_URLS, CHRONICLE_ADDRESS_HISTORY_ROUTE } from '@core/network/constants/chronicle-urls.constant'
    import { getSelectedAccount } from '@core/account'
    import { Button, Error, FontWeight, KeyValueBox, Text, TextType, Spinner } from 'shared/components'
    import VirtualList from '@sveltejs/svelte-virtual-list'
    import { AccountAddress } from '@iota/sdk/out/types'
    import { closePopup } from '@auxiliary/popup/actions/closePopup'
    import { localize } from '@core/i18n'
    import { truncateString } from '@core/utils'

    interface AddressHistory {
        address: string
        items: [
            {
                milestoneIndex: number
                milestoneTimestamp: number
                outputId: string
                isSpent: boolean
            }
        ]
    }

    const account = getSelectedAccount()
    const accountIndex = account.index
    const network = getActiveProfile().network.id
    const ADDRESS_GAP_LIMIT = 20

    let error: string = ''
    let searchURL: string
    let knownAddresses: AccountAddress[] | undefined = undefined
    let searchAddressStartIndex = 0
    let currendSearchGap = 0
    let isBusy = false

    onMount(() => {
        knownAddresses = getSelectedAccount().knownAddresses
        if (knownAddresses === undefined) {
            getSelectedAccount()
                ?.addresses()
                .then((_addressList) => {
                    knownAddresses = _addressList ?? []
                    updateAccountPersistedDataOnActiveProfile(accountIndex, { knownAddresses })
                })
                .catch((err) => {
                    console.error(err)
                })
        }

        if (CHRONICLE_URLS[network] && CHRONICLE_URLS[network].length > 0) {
            const chronicleRoot = CHRONICLE_URLS[network][0]
            searchURL = `${chronicleRoot}${CHRONICLE_ADDRESS_HISTORY_ROUTE}`
        } else {
            error = 'Chronicle not configured'
        }
    })

    async function isAddressWithHistory(address: string): Promise<boolean> {
        try {
            const response = await fetchWithTimeout(`${searchURL}${address}`, 3, { method: 'GET' })
            const addressHistory: AddressHistory = await response.json()
            return addressHistory?.items?.length > 0
        } catch (err) {
            console.error(err)
            error = 'Couldn\'t fetch address history'
        }
    }

    async function generateNextUnknownAddress(): Promise<[string, number]> {
        let nextUnknownAddress: string

        try {
            do {
                nextUnknownAddress = await getProfileManager().generateEd25519Address(
                    accountIndex,
                    searchAddressStartIndex
                )

                searchAddressStartIndex++
            } while (knownAddresses.map((accountAddress) => accountAddress.address).includes(nextUnknownAddress))
        } catch (err) {
            console.error(err)
            error = 'Couldn\'t generate a new address'
        }

        return [nextUnknownAddress, searchAddressStartIndex - 1]
    }

    async function search(): Promise<void> {
        currendSearchGap = 0
        const isUnlocked = await unlock

        if (isUnlocked && !error) {
            isBusy = true
            while (currendSearchGap < ADDRESS_GAP_LIMIT) {
                const [nextAddressToCheck, addressIndex] = await generateNextUnknownAddress()
                if (!nextAddressToCheck) {
                    isBusy = false
                    break
                }

                const hasHistory = await isAddressWithHistory(nextAddressToCheck)
                if (error) {
                    isBusy = false
                    break
                }

                if (hasHistory) {
                    const accountAddress: AccountAddress = {
                        address: nextAddressToCheck,
                        keyIndex: addressIndex,
                        internal: false,
                        used: true,
                    }

                    knownAddresses.push(accountAddress)
                } else {
                    currendSearchGap++
                }
            }

            updateAccountPersistedDataOnActiveProfile(accountIndex, { knownAddresses })
            isBusy = false
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
    {#if error}
        <Error {error} />
    {/if}
</div>
<div class="flex flex-row flex-nowrap w-full space-x-4 mt-6">
    <Button classes="w-full" outline onClick={onCancelClick} disabled={isBusy}>
        {localize('actions.cancel')}
    </Button>
    <Button
        classes="w-full"
        onClick={search}
        disabled={isBusy || !!error}
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
