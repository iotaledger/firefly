<script lang="typescript">
    import { Button, Text } from 'shared/components'
    import { Address } from 'shared/lib/typings/address'
    import { formatUnitBestMatch } from 'shared/lib/units'
    import { Readable } from 'svelte/store'
    import { setClipboard } from 'shared/lib/utils'
    import { Locale } from '@core/i18n'
    import { WalletAccount } from 'shared/lib/typings/wallet'

    export let locale: Locale

    export let account: Readable<WalletAccount>

    let addresses: Address[]
    $: addresses =
        $account?.addresses.slice().sort((a, b) => {
            if (a.keyIndex === b.keyIndex) {
                return a.internal ? 1 : -1
            }

            return b.keyIndex - a.keyIndex
        }) ?? []

    const handleCopyClick = () => {
        setClipboard(addresses.map((a) => `${a.address.toLowerCase()},${a.balance}`).join('\r\n'))
    }
</script>

<div class="mb-5">
    <Text type="h4">{locale('popups.addressHistory.title', { values: { name: $account.alias } })}</Text>
</div>
<div class="history scrollable-y flex flex-row flex-wrap space-y-7">
    {#each addresses as _addr}
        <div class="flex flex-row flex-wrap space-y-1">
            <Text type="p"
                >{_addr.internal ? locale('popups.addressHistory.internal') : locale('popups.addressHistory.external')}
                {_addr.keyIndex}</Text
            >
            <button class="text-left" on:click={() => setClipboard(_addr.address.toLowerCase())}>
                <Text type="pre">{_addr.address}</Text>
            </button>
            <div class="flex flex-row py-1 items-center">
                <Text classes="mr-4" type="p">
                    {locale('popups.addressHistory.currentBalance', {
                        values: { balance: formatUnitBestMatch(_addr.balance) },
                    })}
                </Text>
            </div>
        </div>
    {/each}
</div>
<div class="flex w-full justify-center pt-8">
    <Button classes="w-1/2" onClick={() => handleCopyClick()}>{locale('actions.copy')}</Button>
</div>

<style type="text/scss">
    .history {
        max-height: 50vh;
        @screen md {
            max-height: 30vh;
        }
    }
</style>
