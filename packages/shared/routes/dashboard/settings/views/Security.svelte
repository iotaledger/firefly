<script>
    import zxcvbn from 'zxcvbn'
    import { Text, Dropdown, Password, Button, Checkbox } from 'shared/components'
    import { getActiveProfile, removeProfile } from 'shared/lib/app'
    import { api, destroyActor } from 'shared/lib/wallet'

    export let locale
    export let navigate

    let exportStrongholdChecked
    let currentPassword = ''
    let newPassword = ''
    let confirmedPassword = ''

    $: strength = zxcvbn(newPassword).score
    $: valid = strength === 4 && newPassword === confirmedPassword

    const PincodeManager = window['Electron']['PincodeManager']

    function reset() {
        const activeProfile = getActiveProfile()

        PincodeManager.remove(activeProfile.id)
            .then((isRemoved) => {
                if (!isRemoved) {
                    throw new Error('Something went wrong removing pincode entry.')
                }

                // Remove storage
                api.removeStorage({
                    onSuccess(res) {
                        // Destroy wallet.rs actor for this profile
                        destroyActor(activeProfile.id)

                        // Remove profile from (local) storage
                        removeProfile(activeProfile.id)

                        // Navigate
                        navigate({ reset: true })
                    },
                    onError(error) {
                        console.error(error)
                    },
                })
            })
            .catch((error) => console.error(error))
    }
</script>

<div>
    <section id="exportStronghold" class="w-3/4">
        <Text type="h4" classes="mb-3">{locale('views.settings.exportStronghold.title')}</Text>
        <Text type="p" secondary classes="mb-5">{locale('views.settings.exportStronghold.description')}</Text>
        <Button classes="w-1/4 h-1/2" onClick={() => {}}>{locale('actions.export')}</Button>
    </section>
    <hr class="border-t border-gray-100 w-full border-solid pb-5 mt-5 justify-center" />
    <section id="appLock" class="w-3/4">
        <Text type="h4" classes="mb-3">{locale('views.settings.appLock.title')}</Text>
        <Text type="p" secondary classes="mb-5">{locale('views.settings.appLock.description')}</Text>
        <Dropdown value="English" items={[{ value: 1, label: 'English' }, { value: 2, label: 'Belula' }]} />
    </section>
    <hr class="border-t border-gray-100 w-full border-solid pb-5 mt-5 justify-center" />
    <section id="changePassword" class="w-3/4">
        <Text type="h4" classes="mb-3">{locale('views.settings.changePassword.title')}</Text>
        <Text type="p" secondary classes="mb-5">{locale('views.settings.changePassword.description')}</Text>
        <Password
            classes="mb-8"
            bind:value={currentPassword}
            showRevealToggle
            {locale}
            placeholder={locale('general.currentPassword')} />
        <Password
            classes="mb-4"
            bind:value={newPassword}
            showRevealToggle
            strengthLevels={4}
            showStrengthLevel
            {strength}
            {locale}
            placeholder={locale('general.newPassword')} />
        <Password
            classes="mb-5"
            bind:value={confirmedPassword}
            showRevealToggle
            {locale}
            placeholder={locale('general.confirmNewPassword')} />
        <Checkbox classes="mb-5" label={locale('actions.exportNewStronghold')} bind:exportStrongholdChecked />
        <Button classes="w-1/4" onClick={() => {}}>{locale('views.settings.changePassword.title')}</Button>
    </section>
    <hr class="border-t border-gray-100 w-full border-solid pb-5 mt-5 justify-center" />
    <section id="resetWallet" class="w-3/4">
        <Text type="h4" classes="mb-3">{locale('views.settings.resetWallet.title')}</Text>
        <Text type="p" secondary classes="mb-5">{locale('views.settings.resetWallet.description')}</Text>
        <Button classes="w-1/4" onClick={reset}>{locale('views.settings.resetWallet.title')}</Button>
    </section>
</div>
