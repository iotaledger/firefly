<script lang="ts">
    import { onMount } from 'svelte'
    import { fade } from 'svelte/transition'
    import { Icon } from '@ui'
    import { closePopup, PopupComponentMap, PopupId } from '@auxiliary/popup'
    import { Icon as IconEnum } from '@auxiliary/icon/enums'
    import { PlatformOption, platform } from '@core/app'
    import { clickOutside } from '@core/utils/ui'

    // Popups
    import AccountSwitcherPopup from './AccountSwitcherPopup.svelte'
    import ActivityDetailsPopup from './ActivityDetailsPopup.svelte'
    import AddNodePopup from './AddNodePopup.svelte'
    import AddProposalPopup from './AddProposalPopup.svelte'
    import AliasConfirmationPopup from './AliasConfirmationPopup.svelte'
    import BackupStrongholdPopup from './BackupStrongholdPopup.svelte'
    import BurnNativeTokensPopup from './BurnNativeTokensPopup.svelte'
    import BurnNativeTokensConfirmationPopup from './BurnNativeTokensConfirmationPopup.svelte'
    import ConfirmationPopup from './ConfirmationPopup.svelte'
    import ConnectLedgerPopup from './ConnectLedgerPopup.svelte'
    import CreateAccountPopup from './CreateAccountPopup.svelte'
    import DeepLinkErrorPopup from './DeepLinkErrorPopup.svelte'
    import DeleteAccountPopup from './DeleteAccountPopup.svelte'
    import DeleteProfilePopup from './DeleteProfilePopup.svelte'
    import DiagnosticsPopup from './DiagnosticsPopup.svelte'
    import EnableLedgerBlindSigningPopup from './EnableLedgerBlindSigningPopup.svelte'
    import ErrorLogPopup from './ErrorLogPopup.svelte'
    import FaucetRequestPopup from './FaucetRequestPopup.svelte'
    import LedgerAppGuidePopup from './LedgerAppGuidePopup.svelte'
    import LedgerConnectionGuidePopup from './LedgerConnectionGuidePopup.svelte'
    import LegalUpdatePopup from './LegalUpdatePopup.svelte'
    import ManageAccountPopup from './ManageAccountPopup.svelte'
    import ManageVotingPowerPopup from './ManageVotingPowerPopup.svelte'
    import MintNativeTokenConfirmationPopup from './MintNativeTokenConfirmationPopup.svelte'
    import MintNativeTokenFormPopup from './MintNativeTokenFormPopup.svelte'
    import MintNftConfirmationPopup from './MintNftConfirmationPopup.svelte'
    import MintNftFormPopup from './MintNftFormPopup.svelte'
    import NodeAuthRequiredPopup from './NodeAuthRequiredPopup.svelte'
    import NodeInfoPopup from './NodeInfoPopup.svelte'
    import ReceiveAddressPopup from './ReceiveAddressPopup.svelte'
    import RemoveNode from './RemoveNode.svelte'
    import RemoveProposalPopup from './RemoveProposalPopup.svelte'
    import RevotePopup from './RevotePopup.svelte'
    import { SendConfirmationPopup, SendFormPopup } from './send'
    import StopVotingPopup from './StopVotingPopup.svelte'
    import BalanceBreakdownPopup from './BalanceBreakdownPopup.svelte'
    import TestDeepLinkFormPopup from './TestDeepLinkFormPopup.svelte'
    import TokenInformationPopup from './TokenInformationPopup.svelte'
    import UnlockStrongholdPopup from './UnlockStrongholdPopup.svelte'
    import VerifyLedgerTransactionPopup from './VerifyLedgerTransactionPopup.svelte'
    import CheckForUpdatesPopup from './CheckForUpdatesPopup.svelte'
    import VoteForProposal from './VoteForProposalPopup.svelte'
    import VotingPowerToZeroPopup from './VotingPowerToZeroPopup.svelte'
    import MetricSystemInfoPopup from './metricSystemInfoPopup.svelte'
    import BalanceFinderPopup from './BalanceFinderPopup.svelte'
    import VestingCollectPopup from './VestingCollectPopup.svelte'

    export let id: PopupId
    export let props: any
    export let hideClose: boolean = false
    export let preventClose: boolean = false
    export let fullScreen: boolean
    export let transition = true
    export let overflow = false
    export let autofocusContent = true
    export let relative = true

    enum PopupSize {
        Small = 'small',
        Medium = 'medium',
        Large = 'large',
    }

    let size: PopupSize = PopupSize.Medium

    $: switch (id) {
        case PopupId.ConnectLedger:
        case PopupId.CreateAccount:
        case PopupId.ManageAccount:
            size = PopupSize.Small
            break
        case PopupId.LedgerAppGuide:
        case PopupId.LedgerConnection:
            size = PopupSize.Large
            break
        default:
            size = PopupSize.Medium
            break
    }

    let popupContent

    const POPUP_MAP: PopupComponentMap = {
        [PopupId.AccountSwitcher]: AccountSwitcherPopup,
        [PopupId.ActivityDetails]: ActivityDetailsPopup,
        [PopupId.AddNode]: AddNodePopup,
        [PopupId.AddProposal]: AddProposalPopup,
        [PopupId.AliasConfirmation]: AliasConfirmationPopup,
        [PopupId.BackupStronghold]: BackupStrongholdPopup,
        [PopupId.BurnNativeTokens]: BurnNativeTokensPopup,
        [PopupId.BurnNativeTokensConfirmation]: BurnNativeTokensConfirmationPopup,
        [PopupId.Confirmation]: ConfirmationPopup,
        [PopupId.ConnectLedger]: ConnectLedgerPopup,
        [PopupId.CreateAccount]: CreateAccountPopup,
        [PopupId.DeepLinkError]: DeepLinkErrorPopup,
        [PopupId.DeleteAccount]: DeleteAccountPopup,
        [PopupId.DeleteProfile]: DeleteProfilePopup,
        [PopupId.Diagnostics]: DiagnosticsPopup,
        [PopupId.EnableLedgerBlindSigning]: EnableLedgerBlindSigningPopup,
        [PopupId.ErrorLog]: ErrorLogPopup,
        [PopupId.FaucetRequest]: FaucetRequestPopup,
        [PopupId.LedgerAppGuide]: LedgerAppGuidePopup,
        [PopupId.LedgerConnection]: LedgerConnectionGuidePopup,
        [PopupId.LegalUpdate]: LegalUpdatePopup,
        [PopupId.ManageAccount]: ManageAccountPopup,
        [PopupId.ManageVotingPower]: ManageVotingPowerPopup,
        [PopupId.MetricSystemInfo]: MetricSystemInfoPopup,
        [PopupId.MintNativeTokenConfirmation]: MintNativeTokenConfirmationPopup,
        [PopupId.MintNativeTokenForm]: MintNativeTokenFormPopup,
        [PopupId.MintNftConfirmation]: MintNftConfirmationPopup,
        [PopupId.MintNftForm]: MintNftFormPopup,
        [PopupId.NodeAuthRequired]: NodeAuthRequiredPopup,
        [PopupId.NodeInfo]: NodeInfoPopup,
        [PopupId.ReceiveAddress]: ReceiveAddressPopup,
        [PopupId.RemoveNode]: RemoveNode,
        [PopupId.RemoveProposal]: RemoveProposalPopup,
        [PopupId.Revote]: RevotePopup,
        [PopupId.SendConfirmation]: SendConfirmationPopup,
        [PopupId.SendForm]: SendFormPopup,
        [PopupId.StopVoting]: StopVotingPopup,
        [PopupId.BalanceBreakdown]: BalanceBreakdownPopup,
        [PopupId.TestDeepLinkForm]: TestDeepLinkFormPopup,
        [PopupId.TokenInformation]: TokenInformationPopup,
        [PopupId.UnlockStronghold]: UnlockStrongholdPopup,
        [PopupId.VerifyLedgerTransaction]: VerifyLedgerTransactionPopup,
        [PopupId.CheckForUpdates]: CheckForUpdatesPopup,
        [PopupId.VoteForProposal]: VoteForProposal,
        [PopupId.VotingPowerToZero]: VotingPowerToZeroPopup,
        [PopupId.BalanceFinder]: BalanceFinderPopup,
        [PopupId.VestingCollect]: VestingCollectPopup,
    }

    function onKey(event: KeyboardEvent): void {
        if (event.key === 'Escape') {
            tryClosePopup()
        }
    }

    function tryClosePopup(): void {
        if (!preventClose) {
            closePopup()
            if ('function' === typeof props?.onCancelled) {
                props?.onCancelled()
            }
        }
    }

    function focusableElements(): HTMLElement[] {
        return [
            ...popupContent.querySelectorAll(
                'a, button, input, textarea, select, details,[tabindex]:not([tabindex="-1"])'
            ),
        ].filter((el) => !el.hasAttribute('disabled'))
    }

    function onFocusFirst(event: FocusEvent): void {
        const elems = focusableElements()
        if (elems && elems.length > 0) {
            elems[elems.length - 1].focus()
        }
        event.preventDefault()
    }

    function onFocusLast(event: FocusEvent): void {
        const elems = focusableElements()
        if (elems && elems.length > 0) {
            elems[0].focus()
        }
        event.preventDefault()
    }

    onMount(() => {
        const elems = focusableElements()
        if (elems && elems.length > 0) {
            elems[hideClose || elems.length === 1 || !autofocusContent ? 0 : 1].focus()
        }
    })
</script>

<svelte:window on:keydown={onKey} />

<popup
    in:fade={{ duration: transition ? 100 : 0 }}
    class={`flex items-center justify-center fixed ${
        $platform === PlatformOption.Windows ? 'top-12' : 'top-0'
    } left-0 w-screen p-6 ${overflow ? '' : 'overflow-hidden'}
                h-full z-20 ${
                    fullScreen
                        ? 'bg-white dark:bg-gray-900'
                        : 'bg-gray-800 bg-opacity-70 dark:bg-black dark:bg-opacity-50'
                }`}
>
    <button type="button" tabindex="0" on:focus={onFocusFirst} />
    <popup-content
        use:clickOutside
        on:clickOutside={tryClosePopup}
        bind:this={popupContent}
        class={`${size} bg-white rounded-xl pt-6 px-6 pb-6 ${
            fullScreen ? 'full-screen dark:bg-gray-900' : 'dark:bg-gray-800 shadow-elevation-4'
        } ${overflow ? 'overflow' : ''} ${relative ? 'relative' : ''}`}
    >
        {#if !hideClose}
            <button on:click={tryClosePopup} class="absolute top-6 right-6 focus:text-blue-500">
                <Icon
                    icon={IconEnum.Close}
                    classes="text-gray-500 dark:text-white hover:text-gray-600 dark:hover:text-gray-100"
                />
            </button>
        {/if}
        <svelte:component this={POPUP_MAP[id]} {...props} />
    </popup-content>
    <button type="button" tabindex="0" on:focus={onFocusLast} />
</popup>

<style lang="scss">
    popup {
        popup-content {
            width: 100%;
            &.small {
                max-width: 360px;
            }
            &.medium {
                max-width: 480px;
            }
            &.large {
                max-width: 630px;
            }
            &:not(.full-screen):not(.overflow) {
                @apply overflow-y-auto;
                max-height: calc(100vh - 50px);
            }
        }
    }
</style>
