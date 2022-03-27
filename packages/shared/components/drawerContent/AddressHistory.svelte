<script lang="typescript">
    import { Button, Text } from 'shared/components'
    import { Address } from 'shared/lib/typings/address'
    import { mobile } from 'shared/lib/app'
    import { localize } from 'shared/lib/i18n'
    import { formatUnitBestMatch } from 'shared/lib/units'
    import { setClipboard } from 'shared/lib/utils'

    export let account

    let addresses: Address[]
    $: addresses =
        account?.addresses.slice().sort((a, b) => {
            if (a.keyIndex === b.keyIndex) {
                return a.internal ? 1 : -1
            }

            return b.keyIndex - a.keyIndex
        }) ?? []

    const handleCopyClick = () => {
        setClipboard(addresses.map((a) => `${a.address.toLowerCase()},${a.balance}`).join('\r\n'))
    }
</script>

<div class="flex flex-col px-6 py-10">
    <div class="mb-5">
        <Text type="h4">{localize('popups.addressHistory.title', { values: { name: account.alias } })}</Text>
    </div>
    <div class="history scrollable-y flex flex-row flex-wrap space-y-7">
        {#each addresses as _addr}
            <div class="flex flex-row flex-wrap space-y-1">
                <Text type="p">
                    {_addr.internal
                        ? localize('popups.addressHistory.internal')
                        : localize('popups.addressHistory.external')}
                    {_addr.keyIndex}
                </Text>
                <button class="text-left" on:click={() => setClipboard(_addr.address.toLowerCase())}>
                    <Text type="pre">{_addr.address}</Text>
                </button>
                <div class="flex flex-row py-1 items-center">
                    <Text classes="mr-4" type="p">
                        {localize('popups.addressHistory.currentBalance', {
                            values: { balance: formatUnitBestMatch(_addr.balance) },
                        })}
                    </Text>
                </div>
            </div>
        {/each}
    </div>
    <div class="flex w-full justify-center pt-8">
        <Button classes={$mobile ? 'w-full' : 'w-1/2'} onClick={() => handleCopyClick()}
            >{localize('actions.copy')}</Button
        >
    </div>
</div>

<style type="text/scss">
    .history {
        max-height: 50vh;
        @screen md {
            max-height: 30vh;
        }
    }
</style>
