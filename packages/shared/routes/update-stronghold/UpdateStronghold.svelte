<script lang="typescript">
    import { Locale } from '@core/i18n'
    import { allowBackButton, updateStrongholdRoute, UpdateStrongholdRoute, UpdateStrongholdRouter } from '@core/router'
    import { Transition } from 'shared/components'
    import { strongholdPassword } from 'shared/lib/app'
    import { onMount } from 'svelte'
    import { ChangePassword, Success, Update } from './views'

    export let locale: Locale

    let updateStrongholdRouter: UpdateStrongholdRouter
    let currentPassword: string = $strongholdPassword

    onMount(() => {
        updateStrongholdRouter = new UpdateStrongholdRouter()
    })

    const next = (event: CustomEvent<any>): void => {
        const eventDetail = event?.detail
        if (eventDetail?.password) {
            currentPassword = eventDetail?.password
        }
        allowBackButton.set(false)
        updateStrongholdRouter.next()
    }
    const previous = (): void => updateStrongholdRouter.previous()
</script>

{#if $updateStrongholdRoute === UpdateStrongholdRoute.Update}
    <Transition>
        <Update {currentPassword} on:next={next} on:previous={previous} {locale} />
    </Transition>
{:else if $updateStrongholdRoute === UpdateStrongholdRoute.ChangePassword}
    <Transition>
        <ChangePassword {currentPassword} on:next={next} {locale} />
    </Transition>
{:else if $updateStrongholdRoute === UpdateStrongholdRoute.Success}
    <Transition>
        <Success {currentPassword} on:next={next} {locale} />
    </Transition>
{/if}
