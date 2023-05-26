<script lang="typescript">
    import { Locale } from '@core/i18n'
    import { allowBackButton, updateStrongholdRoute, UpdateStrongholdRoute, UpdateStrongholdRouter } from '@core/router'
    import { Transition } from 'shared/components'
    import { strongholdPassword } from 'shared/lib/app'
    import { onMount } from 'svelte'
    import { ChangePassword, Success, Update } from './views'
    import { walletSetupType } from '@lib/wallet'

    export let locale: Locale

    let updateStrongholdRouter: UpdateStrongholdRouter
    let currentPassword: string = $strongholdPassword
    let passwordUpdated: boolean = false

    $: isRecovery = !!walletSetupType

    onMount(() => {
        updateStrongholdRouter = new UpdateStrongholdRouter()
    })

    const next = async (event: CustomEvent<any>): Promise<void> => {
        const eventDetail = event?.detail
        if (eventDetail?.password) {
            if ($updateStrongholdRoute === UpdateStrongholdRoute.ChangePassword) {
                passwordUpdated = true
            }
            currentPassword = eventDetail?.password
        }
        allowBackButton.set(false)
        await updateStrongholdRouter.next({ isRecovery })
    }
    const previous = (): void => updateStrongholdRouter.previous()
</script>

{#if $updateStrongholdRoute === UpdateStrongholdRoute.Update}
    <Transition>
        <Update {currentPassword} {next} on:previous={previous} {locale} />
    </Transition>
{:else if $updateStrongholdRoute === UpdateStrongholdRoute.ChangePassword}
    <Transition>
        <ChangePassword {currentPassword} on:next={next} {locale} />
    </Transition>
{:else if $updateStrongholdRoute === UpdateStrongholdRoute.Success}
    <Transition>
        <Success
            allowBack={!passwordUpdated}
            enforceBackup={passwordUpdated}
            {currentPassword}
            on:next={next}
            on:previous={previous}
            {locale}
        />
    </Transition>
{/if}
