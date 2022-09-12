<script lang="typescript">
    import { mobile } from '@core/app'
    import { Locale } from '@core/i18n'
    import { Drawer, Icon } from 'shared/components'
    import { clickOutside } from 'shared/lib/actions'
    import { Platform } from 'shared/lib/platform'
    import { closePopup, popupState } from 'shared/lib/popup'
    import { onMount } from 'svelte'
    import { fade } from 'svelte/transition'

    // Popups
    import AccountSwitcherPopup from './AccountSwitcherPopup.svelte'
    import ActivityDetailsPopup from './ActivityDetailsPopup.svelte'
    import AddNodePopup from './AddNodePopup.svelte'
    import BackupStrongholdPopup from './BackupStrongholdPopup.svelte'
    import ConfirmationPopup from './ConfirmationPopup.svelte'
    import ConnectLedgerPopup from './ConnectLedgerPopup.svelte'
    import CreateAccountPopup from './CreateAccountPopup.svelte'
    import DeepLinkErrorPopup from './DeepLinkErrorPopup.svelte'
    import DeleteAccount from './DeleteAccount.svelte'
    import DeleteProfile from './DeleteProfile.svelte'
    import Diagnostics from './Diagnostics.svelte'
    import EnableLedgerBlindSigningPopup from './EnableLedgerBlindSigningPopup.svelte'
    import ErrorLog from './ErrorLog.svelte'
    import ExportTransactionHistory from './ExportTransactionHistory.svelte'
    import FaucetRequestPopup from './FaucetRequestPopup.svelte'
    import LedgerAppGuidePopup from './LedgerAppGuidePopup.svelte'
    import LedgerConnectionGuidePopup from './LedgerConnectionGuidePopup.svelte'
    import LegalUpdate from './LegalUpdate.svelte'
    import ManageAccountPopup from './ManageAccountPopup.svelte'
    import MintNativeTokenFormPopup from './MintNativeTokenFormPopup.svelte'
    import NodeInfoPopup from './NodeInfoPopup.svelte'
    import ReceiveAddressPopup from './ReceiveAddressPopup.svelte'
    import RemoveNode from './RemoveNode.svelte'
    import SendConfirmationPopup from './SendConfirmationPopup.svelte'
    import SendFormPopup from './SendFormPopup.svelte'
    import StorageDepositBreakdownPopup from './StorageDepositBreakdownPopup.svelte'
    import TestDeepLinkFormPopup from './TestDeepLinkFormPopup.svelte'
    import TokenInformationPopup from './TokenInformationPopup.svelte'
    import UnlockStrongholdPopup from './UnlockStrongholdPopup.svelte'
    import VerifyLedgerTransactionPopup from './VerifyLedgerTransactionPopup.svelte'
    import Version from './Version.svelte'
    import Video from './Video.svelte'
    import WalletFinderPopup from './WalletFinderPopup.svelte'

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
        case 'connectLedger':
        case 'createAccount':
        case 'manageAccount':
            size = PopupSize.Small
            break
        case 'video':
        case 'ledgerAppGuide':
        case 'ledgerConnectionGuide':
            size = PopupSize.Large
            break
        case 'transactionDetails':
            autofocusContent = false
            break
        default:
            size = PopupSize.Medium
            break
    }

    let popupContent

    const types = {
        accountSwitcher: AccountSwitcherPopup,
        unlockStronghold: UnlockStrongholdPopup,
        version: Version,
        backupStronghold: BackupStrongholdPopup,
        confirmation: ConfirmationPopup,
        deepLinkError: DeepLinkErrorPopup,
        deleteAccount: DeleteAccount,
        exportTransactionHistory: ExportTransactionHistory,
        connectLedger: ConnectLedgerPopup,
        ledgerAppGuide: LedgerAppGuidePopup,
        ledgerConnectionGuide: LedgerConnectionGuidePopup,
        verifyLedgerTransaction: VerifyLedgerTransactionPopup,
        nodeInfo: NodeInfoPopup,
        addNode: AddNodePopup,
        removeNode: RemoveNode,
        storageDepositBreakdown: StorageDepositBreakdownPopup,
        errorLog: ErrorLog,
        createAccount: CreateAccountPopup,
        deleteProfile: DeleteProfile,
        diagnostics: Diagnostics,
        walletFinder: WalletFinderPopup,
        video: Video,
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
