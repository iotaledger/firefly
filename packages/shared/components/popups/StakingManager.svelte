<script lang="typescript">
    import { get } from 'svelte/store'
    import { Button, Icon, Spinner, Text } from 'shared/components'
    import { Locale } from 'shared/lib/typings/i18n'
    import { wallet } from 'shared/lib/wallet'
    import { WalletAccount } from '../../lib/typings/wallet'
    import { closePopup, openPopup, popupState } from '../../lib/popup'
    import { onMount } from 'svelte'
    import { canAccountParticipate, getParticipationOverview, isAccountStaked, participate, stopParticipating } from '../../lib/participation'
    import { ParticipationAction } from '../../lib/typings/participation'
    import { isSoftwareProfile } from '../../lib/profile'
    import { checkStronghold } from '../../lib/stronghold'

    export let locale: Locale

    export let accountToAction: WalletAccount
    export let participationAction: ParticipationAction

    let accounts = get($wallet.accounts)
    let isPerformingAction = false

    const resetView = (): void => {
        accountToAction = undefined
        participationAction = undefined
        isPerformingAction = false

        /**
         * NOTE: This is necessary for the page
         * to be re-rendered because updating arrays
         * in place will not update the UI (requires
         * new assignment of variable to cause re-render).
         */
        accounts = accounts
    }

    const handleParticipationAction = async (): Promise<void> => {
        if (!accountToAction || !participationAction) return

        isPerformingAction = true

        console.log('PERFORMING ACTION: ', participationAction, '\nFOR ACCOUNT: ', accountToAction)

        switch (participationAction) {
            case ParticipationAction.Stake:
                await participate(accountToAction)
                    .catch((err) => {
                        console.error(err)

                        resetView()
                    })
                break
            case ParticipationAction.Unstake:
                await stopParticipating(accountToAction)
                    .catch((err) => {
                        console.error(err)

                        resetView()
                    })
                break
            default:
                break
        }

        await getParticipationOverview()

        resetView()
    }

    const handleStakeClick = (account: WalletAccount): void => {
        openPopup({
            type: 'stakingConfirmation',
            props: {
                accountToStake: account,
            },
        }, true)
    }

    const handleUnstakeClick = (account: WalletAccount): void => {
        console.log('UNSTAKE FOR: ', account)

        const _unstake = async () => {
            if ($popupState.type !== 'stakingManager') {
                openPopup({
                    type: 'stakingManager',
                    hideClose: true,
                    preventClose: true,
                    props: {
                        accountToAction: account,
                        participationAction: ParticipationAction.Unstake,
                    },
                })
            } else {
                accountToAction = account
                participationAction = ParticipationAction.Unstake

                await handleParticipationAction()
            }
        }

        if ($isSoftwareProfile) {
            checkStronghold(_unstake)
        } else {
            console.log('TODO: Handle unstake flow for Ledger')
        }
    }

    const handleDoneClick = (): void => {
        closePopup(true)
    }

    onMount(async () => {
        /**
         * NOTE: Because of Stronghold and Ledger prompts to "unlock"
         * the wallets, this popup MAY BE instantiated with an "accountToAction",
         * which is the particular account the user chose to either stake or unstake.
         * We can safely assume here that there are no more confirmations to approve,
         * so we will perform the action (of either staking or unstaking).
         */
        await handleParticipationAction()
    })
</script>


<div class="flex flex-col space-y-5">
    <Text type="h5">
        Choose which wallets you want to stake
    </Text>
    <Text type="p" secondary>
        When you stake a wallet, your funds are cocked.
        You can unlock these wallets at any time, but
        then you won’t get full staking rewards.
    </Text>
    <div class="staking flex flex-col scrollable-y">
        {#each accounts as account}
            {#if canAccountParticipate(account)}
                <div
                    class="w-full space-x-4 mb-4 flex flex-row px-4 py-3 rounded-xl border border-1 border-solid items-center justify-between border-gray-300 dark:border-gray-700 hover:border-gray-500 dark:hover:border-gray-700 focus:border-gray-500 focus:hover:border-gray-700"
                >
                    {#if isAccountStaked(account)}
                        <div class="bg-green-100 rounded-2xl">
                            <Icon icon="success-check" classes="text-white" />
                        </div>
                    {:else}
                        <Icon icon="unlock" />
                    {/if}
                    <div class="flex flex-col w-3/4">
                        <Text type="p" classes="font-extrabold">
                            {account.alias}
                        </Text>
                        <Text type="p" secondary classes="font-extrabold">
                            {account.balance} •
                            <Text type="p" secondary classes="inline">
                                {account.balanceEquiv}
                            </Text>
                        </Text>
                    </div>
                    <Button
                        disabled={isPerformingAction}
                        secondary={isAccountStaked(account?.id)}
                        onClick={() => isAccountStaked(account?.id)
                        ? handleUnstakeClick(account)
                        : handleStakeClick(account)
                    }
                    >
                        {#if accountToAction?.id === account?.id}
                            <Spinner
                                busy={isPerformingAction}
                                message={participationAction === ParticipationAction.Stake ? 'Staking' : 'Unstaking'}
                                classes="justify-center"
                            />
                        {:else}
                            {isAccountStaked(account?.id) ? 'Unstake' : 'Stake'}
                        {/if}
                    </Button>
                </div>
            {/if}
        {/each}
    </div>
    <div></div>
    <div class="flex flex-row space-x-1">
        <Button
            disabled={isPerformingAction}
            classes="w-full"
            onClick={handleDoneClick}
        >
            Done
        </Button>
    </div>
</div>
