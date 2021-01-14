<script>
    import zxcvbn from 'zxcvbn'
    import { Text, Dropdown, Password, Button, Checkbox } from 'shared/components';

    export let locale

    let exportStrongholdChecked
    let currentPassword = ''
    let newPassword = ''
    let confirmedPassword = ''

    $: strength = zxcvbn(newPassword).score
    $: valid = strength === 4 && newPassword === confirmedPassword
</script>

<div>
    <section id="exportStronghold" class='w-3/4'>
        <Text type="h4" classes="mb-3">{locale('views.settings.exportStronghold.title')}</Text>
        <Text type="p" secondary classes="mb-5">{locale('views.settings.exportStronghold.description')}</Text>
        <Button classes="w-1/4 h-1/2" onClick={() => {}}>{locale('actions.export')}</Button>
    </section>
    <hr class='border-t border-gray-100 w-full border-solid pb-5 mt-5 justify-center'/>
    <section id="appLock" class='w-3/4'>
        <Text type="h4" classes="mb-3">{locale('views.settings.appLock.title')}</Text>
        <Text type="p" secondary classes="mb-5">{locale('views.settings.appLock.description')}</Text>
        <Dropdown
            value="English"
            items={[{ value: 1, label: 'English' }, { value: 2, label: 'Belula' }]}/>
    </section>
    <hr class='border-t border-gray-100 w-full border-solid pb-5 mt-5 justify-center'/>
    <section id="changePassword" class='w-3/4'>
        <Text type="h4" classes="mb-3">{locale('views.settings.changePassword.title')}</Text>
        <Text type="p" secondary classes="mb-5">{locale('views.settings.changePassword.description')}</Text>
        <Password
            classes="mb-8"
            bind:value={currentPassword}
            showRevealToggle
            {locale} 
            placeholder={locale('general.currentPassword')}/>
        <Password
            classes="mb-4"
            bind:value={newPassword}
            showRevealToggle
            strengthLevels={4}
            showStrengthLevel
            {strength}
            {locale} 
            placeholder={locale('general.newPassword')}/>
        <Password
            classes="mb-5"
            bind:value={confirmedPassword}
            showRevealToggle
            {locale} 
            placeholder={locale('general.confirmNewPassword')}/>
        <Checkbox classes="mb-5" label={locale('actions.exportNewStronghold')} bind:exportStrongholdChecked />
        <Button classes="w-1/4" onClick={() => {}}>{locale('views.settings.changePassword.title')}</Button>
    </section>
    <hr class='border-t border-gray-100 w-full border-solid pb-5 mt-5 justify-center'/>
    <section id="resetWallet" class='w-3/4'>
        <Text type="h4" classes="mb-3">{locale('views.settings.resetWallet.title')}</Text>
        <Text type="p" secondary classes="mb-5">{locale('views.settings.resetWallet.description')}</Text>
        <Button classes="w-1/4" onClick={() => {}}>{locale('views.settings.resetWallet.title')}</Button>
    </section>
</div>