<script lang="typescript">
    import { fly } from 'svelte/transition'
    import { Text, Button, Dropdown, Amount, Address } from '@shared-components'

    export let locale
    export let mobile
    export let onSendClick

    // TODO: CLEAN ALL THIS
    enum RECEIVER_TYPES {
        ADDRESS,
        ACCOUNT,
    }

    let amount = null
    let unit = 'MIOTA'
    let originAcount: number
    let destinationType: RECEIVER_TYPES = null
    let destinationAddress: string
    let destinationAccount: number
    let loading = false
    let reference

    const accounts = [
        { value: 1, label: 'Personal' },
        { value: 2, label: 'Savings' },
    ]

    const handleSelectDestinationClick = (type: RECEIVER_TYPES) => {
        destinationType = type
    }
    const handleSelectOriginAddress = (value) => {
        originAcount = value
    }
    const handleSelecDestinationAddress = (value) => {
        destinationAccount = value
    }

    const handleSendClick = () => {
        loading = true
        setTimeout(() => {
            var audio = new Audio('../../assets/sounds/send.mp3')
            audio.play()
            onSendClick()
        }, 1000)
    }

    $: validSendToAddress = !loading && amount && originAcount !== null && destinationAddress
    $: validSendToAccount = !loading && amount && originAcount !== null && destinationAccount !== null
</script>

<style type="text/scss">
    send {
        :global(button.icon) {
            background-color: var(--app-bg-color);
            border: 1px solid var(--line-separator-color);
        }
        to {
            @apply p-5;
            background-color: var(--line-separator-color);
            border-radius: 16px;
        }
    }
</style>

{#if mobile}
    <div>foo</div>
{:else}
    <send class="h-full p-8 flex flex-col" transition:fly={{ x: 360, duration: 280, opacity: 0 }}>
        <Text type="h4" classes="text-center mb-10">{locale('general.send_funds')}</Text>
        {#if destinationType === null}
            <div class="w-full h-full">
                <Button
                    icon="send"
                    classes="w-full mb-5"
                    secondary
                    onClick={() => handleSelectDestinationClick(RECEIVER_TYPES.ADDRESS)}>
                    {locale('general.send_to_address')}
                    <Text type="p" secondary>{locale('general.scan_qr_or_paste')}</Text>
                </Button>
                <Button
                    icon="transfer"
                    classes="w-full mb-5"
                    secondary
                    onClick={() => handleSelectDestinationClick(RECEIVER_TYPES.ACCOUNT)}>
                    {locale('general.transfer_between_accounts')}
                    <Text type="p" secondary>{locale('general.move_funds_between_accounts')}</Text>
                </Button>
            </div>
        {:else if destinationType === RECEIVER_TYPES.ADDRESS}
            <div transition:fly={{ x: 360, duration: 280, opacity: 0 }} class="w-full h-full flex flex-col justify-between">
                <div>
                    <from class="block mb-8">
                        <Text type="h5" classes="mb-4">{locale('general.sending_to_address')}</Text>
                        <Dropdown
                            value={originAcount ? accounts.find((acc) => acc.value === originAcount).label : accounts[0].label}
                            items={accounts}
                            onSelect={handleSelectOriginAddress} />
                    </from>
                    <to class="w-full mb-8 block">
                        <Text type="h5" classes="mb-4">{locale('general.sending_to_address')}</Text>
                        <Amount bind:amount {unit} {locale} classes="mb-4" />
                        <Address bind:address={destinationAddress} {locale} />
                    </to>
                    <reference class="w-full mb-8 block">
                        <Text type="h5" classes="mb-4">{locale('general.reference')}</Text>
                    </reference>
                </div>
                <div>
                    <Button disabled={!validSendToAddress} classes="w-full" onClick={() => handleSendClick()}>
                        {locale('actions.send')}
                    </Button>
                </div>
            </div>
        {:else if destinationType === RECEIVER_TYPES.ACCOUNT}
            <div transition:fly={{ x: 360, duration: 280, opacity: 0 }} class="w-full h-full flex flex-col justify-between">
                <div>
                    <from class="block mb-8">
                        <Text type="h5" classes="mb-4">{locale('general.sending_to_address')}</Text>
                        <Dropdown
                            value={originAcount ? accounts.find((acc) => acc.value === originAcount).label : accounts[0].label}
                            items={accounts}
                            onSelect={handleSelectOriginAddress} />
                    </from>
                    <to class="w-full mb-8 block">
                        <Text type="h5" classes="mb-4">{locale('general.transfer_between_accounts')}</Text>
                        <Amount bind:amount {unit} {locale} classes="mb-4" />
                        <Dropdown
                            value={destinationAccount ? accounts.find((acc) => acc.value === destinationAccount).label : accounts[0].label}
                            items={accounts}
                            onSelect={handleSelecDestinationAddress} />
                    </to>
                    <reference class="w-full mb-8 block">
                        <Text type="h5" classes="mb-4">{locale('general.reference')}</Text>
                    </reference>
                </div>
                <div>
                    <Button disabled={!validSendToAccount} classes="w-full" onClick={() => handleSendClick()}>
                        {locale('actions.send')}
                    </Button>
                </div>
            </div>
        {/if}
    </send>
{/if}
