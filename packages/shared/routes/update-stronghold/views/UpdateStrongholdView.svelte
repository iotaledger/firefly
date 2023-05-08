<script lang="ts">
    import { Animation, Button, OnboardingLayout, Password, Spinner, Text } from 'shared/components'
    import { localize } from '@core/i18n'
    import { updateStrongholdRouter } from '@core/router'
    import { Router } from '@core/router/router'
    import { activeProfileId } from '@lib/profile'
    import { destroyActor } from '@lib/wallet'
    import { strongholdPassword } from '@lib/app'

    export let parentRouter: Router<unknown>
    export let isRecovery: boolean

    let busy = false
    let password: string = ''
    let error: string = ''

    $: password, (error = '')

    function onBackClick(): void {
        destroyActor($activeProfileId)
        $updateStrongholdRouter.previous()
        parentRouter.previous()
    }

    async function onContinueClick(): Promise<void> {
        busy = true

        $strongholdPassword = password
        await $updateStrongholdRouter.next({ isRecovery })
        if (!$strongholdPassword) {
            error = localize('error.password.incorrect')
        }

        busy = false
    }
</script>

<update-stronghold-view>
    <OnboardingLayout allowBack={false}>
        <div slot="title">
            <Text type="h2" classes="mb-5">{localize('views.login.updateStronghold.title')}</Text>
        </div>
        <div slot="leftpane__content">
            <Text type="p" secondary classes="mb-8">
                {localize('views.login.updateStronghold.body')}
                {localize(`views.login.updateStronghold.${isRecovery ? 'continue' : 'providePassword'}`)}
            </Text>
            <Password
                classes="mb-6"
                {error}
                bind:value={password}
                locale={localize}
                showRevealToggle
                autofocus
                disabled={busy}
                submitHandler={() => void onContinueClick()}
            />
        </div>
        <div slot="leftpane__action">
            <Button classes="w-full" disabled={busy || !password} onClick={onContinueClick}>
                {#if busy}
                    <Spinner {busy} message={localize('actions.updating')} classes="justify-center" />
                {:else}
                    {localize('actions.continue')}
                {/if}
            </Button>
        </div>
        <div slot="rightpane" class="w-full h-full flex justify-center bg-pastel-orange dark:bg-gray-900">
            <Animation animation="backup-desktop" />
        </div>
    </OnboardingLayout>
</update-stronghold-view>
