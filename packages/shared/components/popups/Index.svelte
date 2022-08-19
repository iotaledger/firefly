<script lang="typescript">
    import { Drawer, Icon } from 'shared/components'
    import { clickOutside } from 'shared/lib/actions'
    import { closePopup, popupState } from 'shared/lib/popup'
    import { Locale } from '@core/i18n'
    import { backButtonStore } from '@core/router'
    import { onMount } from 'svelte'
    import { fade } from 'svelte/transition'
    import AddNode from './AddNode.svelte'
    import AddressHistory from './AddressHistory.svelte'
    import AirdropNetworkInfo from './AirdropNetworkInfo.svelte'
    import Backup from './Backup.svelte'
    import BalanceFinder from './BalanceFinder.svelte'
    import Busy from './Busy.svelte'
    import CrashReporting from './CrashReporting.svelte'
    import CreateAccount from './CreateAccount.svelte'
    import DeleteAccount from './DeleteAccount.svelte'
    import DeleteProfile from './DeleteProfile.svelte'
    import Diagnostics from './Diagnostics.svelte'
    import ErrorLog from './ErrorLog.svelte'
    import ExportTransactionHistory from './ExportTransactionHistory.svelte'
    import GovernanceManager from './GovernanceManager.svelte'
    import HideAccount from './HideAccount.svelte'
    import LedgerAddress from './LedgerAddress.svelte'
    import LedgerAppGuide from './LedgerAppGuide.svelte'
    import LedgerConfirmation from './LedgerConfirmation.svelte'
    import LedgerConnectionGuide from './LedgerConnectionGuide.svelte'
    import LedgerLegacyTransaction from './LedgerLegacyTransaction.svelte'
    import LedgerMigrateIndex from './LedgerMigrateIndex.svelte'
    import LedgerNotConnected from './LedgerNotConnected.svelte'
    import LedgerTransaction from './LedgerTransaction.svelte'
    import MissingBundle from './MissingBundle.svelte'
    import NodeInfo from './NodeInfo.svelte'
    import Password from './Password.svelte'
    import QR from './QR.svelte'
    import RemoveNode from './RemoveNode.svelte'
    import RiskFunds from './RiskFunds.svelte'
    import Snapshot from './Snapshot.svelte'
    import StakingConfirmation from './StakingConfirmation.svelte'
    import StakingManager from './StakingManager.svelte'
    import Success from './Success.svelte'
    import NewStakingPeriodNotification from './NewStakingPeriodNotification.svelte'
    import NetworkStatus from './NetworkStatus.svelte'
    import SwitchNetwork from './SwitchNetwork.svelte'
    import Transaction from './Transaction.svelte'
    import Version from './Version.svelte'
    import Video from './Video.svelte'
    import ConfirmDeveloperProfile from './ConfirmDeveloperProfile.svelte'
    import ConfirmCloseApp from './ConfirmCloseApp.svelte'
    import LegalUpdate from './LegalUpdate.svelte'
    import SingleAccountGuide from './SingleAccountGuide.svelte'
    import NodeConfigOptions from './NodeConfigOptions.svelte'
    import { mobile } from 'shared/lib/app'
    import { Platform } from 'shared/lib/platform'

    export let locale: Locale

    export let type: string
    export let props: any
    export let hideClose: boolean
    export let preventClose: boolean
    export let fullScreen: boolean
    export let transition = true
    export let overflow = false

    let autofocusContent = true

    enum PopupSize {
        Small = 'small',
        Medium = 'medium',
        Large = 'large',
    }

    let size: PopupSize = PopupSize.Medium
    let os = ''

    $: switch (type) {
        case 'ledgerNotConnected':
        case 'createAccount':
            size = PopupSize.Small
            break
        case 'video':
        case 'ledgerAppGuide':
        case 'ledgerConnectionGuide':
            size = PopupSize.Large
            break
        case 'stakingManager':
            autofocusContent = false
            break
        default:
            size = PopupSize.Medium
            break
    }

    let popupContent

    const types = {
        qr: QR,
        password: Password,
        version: Version,
        backup: Backup,
        deleteAccount: DeleteAccount,
        exportTransactionHistory: ExportTransactionHistory,
        hideAccount: HideAccount,
        addressHistory: AddressHistory,
        ledgerNotConnected: LedgerNotConnected,
        ledgerConfirmation: LedgerConfirmation,
        ledgerAppGuide: LedgerAppGuide,
        ledgerConnectionGuide: LedgerConnectionGuide,
        ledgerTransaction: LedgerTransaction,
        ledgerLegacyTransaction: LedgerLegacyTransaction,
        ledgerAddress: LedgerAddress,
        ledgerMigrateIndex: LedgerMigrateIndex,
        nodeInfo: NodeInfo,
        networkStatus: NetworkStatus,
        addNode: AddNode,
        removeNode: RemoveNode,
        switchNetwork: SwitchNetwork,
        busy: Busy,
        errorLog: ErrorLog,
        crashReporting: CrashReporting,
        createAccount: CreateAccount,
        deleteProfile: DeleteProfile,
        diagnostics: Diagnostics,
        transaction: Transaction,
        riskFunds: RiskFunds,
        missingBundle: MissingBundle,
        balanceFinder: BalanceFinder,
        snapshot: Snapshot,
        video: Video,
        // Participation (voting / staking)
        stakingConfirmation: StakingConfirmation,
        stakingManager: StakingManager,
        newStakingPeriodNotification: NewStakingPeriodNotification,
        airdropNetworkInfo: AirdropNetworkInfo,
        confirmDeveloperProfile: ConfirmDeveloperProfile,
        confirmCloseApp: ConfirmCloseApp,
        legalUpdate: LegalUpdate,
        governanceManager: GovernanceManager,
        success: Success,
        singleAccountGuide: SingleAccountGuide,
        nodeConfigOptions: NodeConfigOptions,
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
        $backButtonStore?.add(closePopup as () => Promise<void>)
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
        <div bind:this={popupContent} class="py-10 px-5">
            <svelte:component this={types[type]} {...props} {locale} />
        </div>
    </Drawer>
{:else}
    <popup
        in:fade={{ duration: transition ? 100 : 0 }}
        class={`flex items-center justify-center fixed ${os === 'win32' ? 'top-9' : 'top-0'} left-0 w-screen p-6 ${
            overflow ? '' : 'overflow-hidden'
        }
                h-full z-20 ${fullScreen ? 'bg-white dark:bg-gray-900' : 'bg-gray-800 bg-opacity-40'} ${
            $mobile && 'z-40'
        }`}
    >
        <div tabindex="0" on:focus={handleFocusFirst} />
        <popup-content
            use:clickOutside
            on:clickOutside={tryClosePopup}
            bind:this={popupContent}
            class={`${size} bg-white rounded-xl pt-6 px-8 pb-8 ${
                fullScreen ? 'full-screen dark:bg-gray-900' : 'dark:bg-gray-900 shadow-elevation-4'
            } ${overflow ? 'overflow' : 'relative'}`}
        >
            {#if !hideClose}
                <button
                    on:click={tryClosePopup}
                    class="absolute top-6 right-8 text-gray-800 dark:text-white focus:text-blue-500"
                >
                    <Icon icon="close" />
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
