<script lang="typescript">
    import { wallet, api } from 'shared/lib/wallet'
    import { Button, Checkbox, Text, ButtonCheckbox } from 'shared/components'
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
    $: accountsToLink = []

    function handleAccountClick(acc) {
        if(accountsToLink.findIndex(a=>a.id===acc.id) > -1) {
            accountsToLink = accountsToLink.filter(a=> a.id!==acc.id)
        } else {
            accountsToLink = [...accountsToLink, acc]
        }
    }

    $: timeHasPassed = false

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
                    accounts: accountsToLink,
                    id: ap.id,
                    name: ap.name,
                })
            }, {
                onSuccess: r=> console.log("SUCCESS1!", r),
                onError: r=> console.log("ONERROR", r)
            })
            setTimeout(()=>{
                timeHasPassed = true
            }, 2500)
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

<Text type="h4" classes="mb-5">Connect Firefly to Glow</Text>

{#if !emojis}
    {#if $isStrongholdLocked}
        <div class="w-full h-full mb-5">
            <Text>Choose which accounts you want to connect to Glow</Text>
        </div>
    {/if}
    <div class={"overflow-y-auto max-h-80"}>
        <div class={"flex flex-col justify-center align-center items-center"}>
            {#each accountsDropdownItems as acc}
                <button
                    on:click={()=> handleAccountClick(acc)}
                    type="button"
                    class="w-full flex flex-row p-4 mb-4 rounded-2xl border border-1 border-solid items-center justify-between border-gray-300 dark:border-gray-700 hover:border-gray-500 dark:hover:border-gray-700 focus:border-gray-500 focus:hover:border-gray-700"
                    style="height: 64px">
                    <div class="flex flex-row items-center justify-between w-full pr-5">
                        <Text smaller classes="ml-3">{acc.alias}</Text>
                        <Text smaller classes="ml-3">{acc.balance}</Text>
                    </div>
                    <Checkbox checked={accountsToLink.findIndex(a=>a.id===acc.id) > -1} classes="mb-0 pointer-events-none" tabindex={-1} />
                </button>   
            {/each}
        </div>
    </div>
    <div class="flex flex-row justify-between w-full space-x-4 px-8">
        <Button secondary classes="w-1/2" onClick={closePopup}>{locale('actions.cancel')}</Button>
        <Button classes="w-1/2" onClick={startLink} disabled={!accountsToLink.length}>
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
        <Button classes="w-1/2" onClick={finishLink} disabled={!accountsToLink.length || !timeHasPassed}>
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
.acc {
    border-radius: 10px;
    cursor:pointer;
    width:100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
}
</style>