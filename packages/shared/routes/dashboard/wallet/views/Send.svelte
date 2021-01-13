<script lang="typescript">
    import { api } from 'shared/lib/wallet'
    import { createEventDispatcher } from 'svelte'
    import { fly } from 'svelte/transition'
    import { Text, Button, Dropdown, Amount, Address } from 'shared/components'
    export let locale
    export let mobile
    export let accounts = []

    const dispatch = createEventDispatcher()

    $: accountsDropdownItems = accounts.map((acc) => ({ value: acc.id, label: `${acc.name} • ${acc.balanceEquiv}` }))

    let from = accounts.map((acc) => ({ value: acc.id, label: `${acc.name} • ${acc.balanceEquiv}` }))[0]
    let to = ''
    let amount = 0.0
    let reference = ''
    let unit = 'MIOTA'
    let loading = false
    
    const handleFromSelect = (item) => {
        from = item
    }
    
    const handleSendClick = () => {
        loading = true

        api.send(
            from.value,
            {
                amount,
                address: to,
                remainder_value_strategy: {
                    strategy: 'ChangeAddress'
                },
                indexation: { index: 'firefly', data: new Array() }
            },
            {
                onSuccess(response) {
                    const audio = new Audio('../../assets/sounds/send.mp3')
                    audio.play()
                    dispatch('next')
                },
                onError(error) {
                    console.error(error);
                }
            }
)
    }
</script>

{#if mobile}
    <div>foo</div>
{:else}
    <div transition:fly={{ x: 360, duration: 280, opacity: 0 }}>
        <div class="flex flex-row mb-6">
            <Text type="h5">{locale('general.send_funds')}</Text>
        </div>
        <div class="w-full h-full flex flex-col justify-between">
            <div>
                <div class="block mb-8">
                    <Dropdown
                        value={from?.label || ''}
                        label={locale('general.from')}
                        items={accountsDropdownItems}
                        onSelect={handleFromSelect} />
                </div>
                <div class="w-full mb-8 block">
                    <Amount bind:amount {unit} {locale} classes="mb-4" />
                    <Address bind:address={to} {locale} label={locale('general.to')} />
                </div>
                <div class="w-full mb-8 block">
                    <Text type="h5" classes="mb-4">{locale('general.reference')}</Text>
                </div>
            </div>
        </div>
    </div>
    <!-- Action -->
    <div class="flex flex-row justify-between px-2" transition:fly={{ x: 360, duration: 280, opacity: 0 }}>
        <Button secondary classes="-mx-2 w-1/2" onClick={() => handleSendClick()}>{locale('actions.back')}</Button>
        <Button classes="-mx-2 w-1/2" onClick={() => handleSendClick()}>{locale('actions.send')}</Button>
    </div>
{/if}
