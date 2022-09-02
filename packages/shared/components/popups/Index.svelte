<script lang="typescript">
    import { Drawer, Icon } from 'shared/components'
    import { clickOutside } from 'shared/lib/actions'
    import { closePopup, popupState } from 'shared/lib/popup'
    import { Locale } from '@core/i18n'
    import { onMount } from 'svelte'
    import { fade } from 'svelte/transition'
    import AddNodePopup from './AddNodePopup.svelte'
    import AirdropNetworkInfo from './AirdropNetworkInfo.svelte'
    import BackupStrongholdPopup from './BackupStrongholdPopup.svelte'
    import CrashReporting from './CrashReporting.svelte'
    import CreateAccountPopup from './CreateAccountPopup.svelte'
    import ConfirmationPopup from './ConfirmationPopup.svelte'
    import DeleteAccount from './DeleteAccount.svelte'
    import DeleteProfile from './DeleteProfile.svelte'
    import Diagnostics from './Diagnostics.svelte'
    import ErrorLog from './ErrorLog.svelte'
    import ExportTransactionHistory from './ExportTransactionHistory.svelte'
    import LedgerAppGuidePopup from './LedgerAppGuidePopup.svelte'
    import LedgerConnectionGuidePopup from './LedgerConnectionGuidePopup.svelte'
    import PromptLedgerConnectionPopup from './PromptLedgerConnectionPopup.svelte'
    import VerifyLedgerTransactionPopup from './VerifyLedgerTransactionPopup.svelte'
    import MissingBundle from './MissingBundle.svelte'
    import NodeInfoPopup from './NodeInfoPopup.svelte'
    import PasswordPopup from './PasswordPopup.svelte'
    import QR from './QR.svelte'
    import RemoveNode from './RemoveNode.svelte'
    import RiskFunds from './RiskFunds.svelte'
    import Snapshot from './Snapshot.svelte'
    import StakingConfirmation from './StakingConfirmation.svelte'
    import StakingManager from './StakingManager.svelte'
    import StorageDepositBreakdownPopup from './StorageDepositBreakdownPopup.svelte'
    import NewStakingPeriodNotification from './NewStakingPeriodNotification.svelte'
    import Version from './Version.svelte'
    import Video from './Video.svelte'
    import WalletFinderPopup from './WalletFinderPopup.svelte'
    import ConfirmDeveloperProfile from './ConfirmDeveloperProfile.svelte'
    import LegalUpdate from './LegalUpdate.svelte'
    import { mobile } from '@core/app'
    import { Platform } from 'shared/lib/platform'
    import ActivityDetailsPopup from './ActivityDetailsPopup.svelte'
    import ReceiveAddressPopup from './ReceiveAddressPopup.svelte'
    import SendConfirmationPopup from './SendConfirmationPopup.svelte'
    import SendFormPopup from './SendFormPopup.svelte'
    import ManageAccountPopup from './ManageAccountPopup.svelte'
    import TokenInformationPopup from './TokenInformationPopup.svelte'
    import MintNativeTokenFormPopup from './MintNativeTokenFormPopup.svelte'
    import FaucetRequestPopup from './FaucetRequestPopup.svelte'
    import EnableLedgerBlindSigningPopup from './EnableLedgerBlindSigningPopup.svelte'
    import TestDeepLinkFormPopup from './TestDeepLinkFormPopup.svelte'

    export let locale: Locale

    export let type: string
    export let props: any
    export let hideClose: boolean
    export let preventClose: boolean
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
    let os = ''

    $: switch (type) {
        case 'promptLedgerConnection':
        case 'createAccount':
        case 'manageAccount':
            size = PopupSize.Small
            break
        case 'video':
        case 'ledgerAppGuide':
        case 'ledgerConnectionGuide':
            size = PopupSize.Large
            break
        case 'stakingManager':
        case 'transactionDetails':
            autofocusContent = false
            break
        default:
            size = PopupSize.Medium
            break
    }

    let popupContent

    const types = {
        qr: QR,
        password: PasswordPopup,
        version: Version,
        backupStronghold: BackupStrongholdPopup,
        confirmation: ConfirmationPopup,
        deleteAccount: DeleteAccount,
        exportTransactionHistory: ExportTransactionHistory,
        promptLedgerConnection: PromptLedgerConnectionPopup,
        ledgerAppGuide: LedgerAppGuidePopup,
        ledgerConnectionGuide: LedgerConnectionGuidePopup,
        verifyLedgerTransaction: VerifyLedgerTransactionPopup,
        nodeInfo: NodeInfoPopup,
        addNode: AddNodePopup,
        removeNode: RemoveNode,
        storageDepositBreakdown: StorageDepositBreakdownPopup,
        errorLog: ErrorLog,
        crashReporting: CrashReporting,
        createAccount: CreateAccountPopup,
        deleteProfile: DeleteProfile,
        diagnostics: Diagnostics,
        riskFunds: RiskFunds,
        missingBundle: MissingBundle,
        walletFinder: WalletFinderPopup,
        snapshot: Snapshot,
        video: Video,
        // Participation (voting / staking)
        stakingConfirmation: StakingConfirmation,
        stakingManager: StakingManager,
        newStakingPeriodNotification: NewStakingPeriodNotification,
        airdropNetworkInfo: AirdropNetworkInfo,
        confirmDeveloperProfile: ConfirmDeveloperProfile,
        legalUpdate: LegalUpdate,
        receiveAddress: ReceiveAddressPopup,
        activityDetails: ActivityDetailsPopup,
        sendConfirmation: SendConfirmationPopup,
        sendForm: SendFormPopup,
        manageAccount: ManageAccountPopup,
        tokenInformation: TokenInformationPopup,
        mintNativeTokenForm: MintNativeTokenFormPopup,
        faucetRequest: FaucetRequestPopup,
        enableLedgerBlindSigning: EnableLedgerBlindSigningPopup,
        testDeepLinkForm: TestDeepLinkFormPopup,
    }

    const onKey = (e) => {
        if (e.key === 'Escape') {
            tryClosePopup()
        }
    }

    const tryClosePopup = (): void => {
        if (!preventClose) {
            if ('function' === typeof props?.onCancelled) {
                props?.onCancelled()
            }
            closePopup()
        }
    }

    const focusableElements = () =>
        [
            ...popupContent.querySelectorAll(
                'a, button, input, textarea, select, details,[tabindex]:not([tabindex="-1"])'
            ),
        ].filter((el) => !el.hasAttribute('disabled'))

    const handleFocusFirst = (e) => {
        const elems = focusableElements()
        if (elems && elems.length > 0) {
            elems[elems.length - 1].focus()
        }
        e.preventDefault()
    }
    const handleFocusLast = (e) => {
        const elems = focusableElements()
        if (elems && elems.length > 0) {
            elems[0].focus()
        }
        e.preventDefault()
    }

    onMount(async () => {
        const elems = focusableElements()
        if (elems && elems.length > 0) {
            elems[hideClose || elems.length === 1 || !autofocusContent ? 0 : 1].focus()
        }
        os = await Platform.getOS()
    })
</script>

<svelte:window on:keydown={onKey} />
{#if $mobile && !fullScreen}
    <Drawer opened zIndex="z-40" preventClose={hideClose} on:close={() => closePopup($popupState?.preventClose)}>
        <div bind:this={popupContent} class="p-8">
            <svelte:component this={types[type]} {...props} {locale} />
        </div>
    </Drawer>
{:else}
    <popup
        in:fade={{ duration: transition ? 100 : 0 }}
        class={`flex items-center justify-center fixed ${os === 'win32' ? 'top-9' : 'top-0'} left-0 w-screen p-6 ${
            overflow ? '' : 'overflow-hidden'
        }
                h-full z-20 ${
                    fullScreen
                        ? 'bg-white dark:bg-gray-900'
                        : 'bg-gray-800 bg-opacity-70 dark:bg-black dark:bg-opacity-50'
                } ${$mobile && 'z-40'}`}
    >
        <div tabindex="0" on:focus={handleFocusFirst} />
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
                        icon="close"
                        classes="text-gray-500 dark:text-white hover:text-gray-600 dark:hover:text-gray-100"
                    />
                </button>
            {/if}
            <svelte:component this={types[type]} {...props} {locale} />
        </popup-content>
        <div tabindex="0" on:focus={handleFocusLast} />
    </popup>
{/if}

<style type="text/scss">
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
