<script lang="ts">
    import { localize } from '@core/i18n'
    import {
        FontWeight,
        Tabs,
        Text,
        TextType,
    } from 'shared/components'
    import SendTokenForm from './SendTokenForm.svelte'
    import SendNftForm from './SendNftForm.svelte';

    enum SendForm {
        SendToken = 'general.sendToken',
        SendNft = 'general.sendNft',
    }

    const tabs: SendForm[] = [SendForm.SendToken, SendForm.SendNft]
    let activeTab: SendForm = SendForm.SendToken
</script>

<send-form-popup class="w-full h-full space-y-6 flex flex-auto flex-col shrink-0">
    <Text type={TextType.h3} fontWeight={FontWeight.semibold} classes="text-left">
        {localize('popups.transaction.title')}
    </Text>
    <Tabs bind:activeTab {tabs} />
    {#if activeTab === SendForm.SendToken}
        <SendTokenForm />
    {:else}
        <SendNftForm />
    {/if}
</send-form-popup>
