<script lang="typescript">
    import { HR } from 'shared/components'
    import { Platform } from 'shared/lib/platform'
    import { isSoftwareProfile, updateProfile } from 'shared/lib/profile'
    import { SecuritySettings } from '@core/router'
    import { getDefaultStrongholdName } from 'shared/lib/utils'
    import { api } from 'shared/lib/wallet'
    import { AppLock, ChangePassword, ChangePincode, DeleteProfile, ExportStronghold } from './'

    const settings: {
        component: unknown
        childRoute: SecuritySettings
        requireSoftware?: boolean
    }[] = [
        { component: ExportStronghold, childRoute: SecuritySettings.ExportStronghold, requireSoftware: true },
        { component: AppLock, childRoute: SecuritySettings.AppLock },
        { component: ChangePassword, childRoute: SecuritySettings.ChangePassword, requireSoftware: true },
        { component: ChangePincode, childRoute: SecuritySettings.ChangePincode },
        { component: DeleteProfile, childRoute: SecuritySettings.DeleteProfile },
    ]

    const props = {
        [SecuritySettings.ExportStronghold]: { exportStronghold },
        [SecuritySettings.ChangePassword]: { exportStronghold },
    }

    function exportStronghold(password: string, callback?: (cancelled: boolean, err?: string) => void) {
        Platform.getStrongholdBackupDestination(getDefaultStrongholdName())
            .then((result) => {
                if (result) {
                    api.backup(result, password, {
                        onSuccess() {
                            updateProfile('lastStrongholdBackupTime', new Date())
                            callback(false)
                        },
                        onError(err) {
                            callback(false, err.error)
                        },
                    })
                } else {
                    callback(true)
                }
            })
            .catch((err) => {
                callback(false, err.error)
            })
    }
</script>

<div>
    {#each settings as { component, childRoute, requireSoftware }, index}
        {#if !requireSoftware || (requireSoftware && $isSoftwareProfile)}
            <section id={childRoute} class="w-full sm:w-3/4">
                <svelte:component this={component} {...props[childRoute]} />
            </section>
            {#if index < settings.length - 1}
                <HR classes="pb-5 mt-5 justify-center" />
            {/if}
        {/if}
    {/each}
</div>
