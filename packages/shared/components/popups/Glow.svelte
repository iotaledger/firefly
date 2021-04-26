<script lang="typescript">
    import { selectedAccountId, wallet, isTransferring, api } from 'shared/lib/wallet'
    import { Button, Dropdown, Text } from 'shared/components'
    import { closePopup } from 'shared/lib/popup'
    import { isStrongholdLocked } from 'shared/lib/profile'
    import { randomEmojis } from 'shared/lib/emojiList'
    import { activeProfile } from 'shared/lib/profile'

    const { accounts } = $wallet

    export let locale

    let emojis = ''

    function format(acc){
        return {
            ...acc,
            label: `${acc.alias} • ${acc.balance}`,
            balance: acc.rawIotaBalance,
        }
    }

    $: accountsDropdownItems = $accounts.map((acc) => format(acc))
    $: account = $accounts.find(a=> a.id === $selectedAccountId)

    $: accountToLink = account ? format(account) : (accountsDropdownItems && accountsDropdownItems[0])

    const handleFromSelect = (item) => {
        accountToLink = item
    }

    function startLink() {
        emojis = randomEmojis(4)
        let glowInitted = false
        if (!glowInitted) {
            const ap = $activeProfile
            api.callPlugin({
                plugin:'glow',
                method:'Start',
                payload: JSON.stringify({
                    emojis,
                    accounts: [{id:accountToLink.id}],
                    id: ap.id,
                    name: ap.name,
                })
            }, {
                onSuccess: r=> console.log("SUCCESS1!", r),
                onError: r=> console.log("ONERROR", r)
            })
        } else {
            api.callPlugin({
                plugin:'glow',
                method:'Stop'
            }, {
                onSuccess: r=> glowInitted=false,
                onError: r=> {}
            })
        }
    }

    function finishLink() {
        api.callPlugin({
            plugin:'glow',
            method:'Initialize',
            payload: ''
        }, {
            onSuccess: r=> closePopup(),
            onError: r=> console.log("ONERROR", r)
        })
    }

</script>

<Text type="h4" classes="mb-5">Link Glow</Text>

{#if !emojis}
    {#if $isStrongholdLocked}
        <div class="w-full h-full mb-5">
            <Text>Your Stronghold must be unlocked to use Glow</Text>
        </div>
    {/if}
    <div class={"flex flex-col justify-center align-center items-center"}>
        {#if accountToLink && !$selectedAccountId}
            <div class="block mb-5">
                <Dropdown
                    value={accountToLink?.label || ''}
                    label={'Account to Link'}
                    items={accountsDropdownItems}
                    onSelect={handleFromSelect}
                    disabled={$accounts.length === 1 || $isTransferring} />
            </div>
        {/if}
    </div>
    <div class="flex flex-row justify-between w-full space-x-4 px-8">
        <Button secondary classes="w-1/2" onClick={closePopup}>{locale('actions.cancel')}</Button>
        <Button classes="w-1/2" onClick={startLink} disabled={!accountToLink}>
            {'Link Glow'}
        </Button>
    </div>
{/if}

{#if emojis}
    <div class="w-full h-full mb-5">
        <Text>Verify that the emojis shown in Glow match the following sequence:</Text>
    </div>
    <div class="flex flex-row justify-center w-full">
        <div class="emojis">
            {emojis}
        </div>
    </div>
    <div class="flex flex-row justify-between w-full space-x-4 px-8">
        <Button secondary classes="w-1/2" onClick={closePopup}>{locale('actions.cancel')}</Button>
        <Button classes="w-1/2" onClick={finishLink} disabled={!accountToLink}>
            {'They Match! Link Now'}
        </Button>
    </div>
{/if}

<style>
.emojis {
    margin: 10px 0 33px 0;
    font-size:28px;
    letter-spacing: 12px;
    text-align: center;
    background: white;
    border-radius: 10px;
    padding-left: 14px;
    height: 46px;
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 28px;
    padding-top: 6px;
    transition: 0.3s;
}
</style>