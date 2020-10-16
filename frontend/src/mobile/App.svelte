<script lang="typescript">
    import { onMount } from 'svelte'
    import { setupI18n, isLocaleLoaded, dir, _ } from '@shared-lib/i18n'
    import { darkMode, mobile, logged } from '@shared-lib/app'
    import { goto } from '@shared-lib/helpers'
    import { Route, Toggle } from '@shared-components'
    import {
        Splash,
        Onboarding1,
        Legal,
        Setup,
        Password,
        Protect,
        Pin,
        ConfirmPin,
        Backup,
        RecoveryPhrase,
        VerifyRecoveryPhrase,
        BackupRecoveryPhrase,
        RecoveryPhraseSaved,
        Congratulations,
        Import,
        ImportFromSeed,
        ImportFromSeedVault,
        ImportFromSecurityPhrase,
        ImportFromSecurityPhraseFile,
        Migrate,
        Balance,
        Dashboard,
    } from '@shared-routes'

    let splash = true

    $: $darkMode ? document.body.classList.add('dark') : document.body.classList.remove('dark')
    $: if (document.dir !== $dir) {
        document.dir = $dir
    }

    setupI18n()
    onMount(() => {
        setTimeout(() => {
            splash = false
            if (!$logged) {
                goto('onboarding-1') // dummmy dev only
            } else {
                goto('dashboard') // dummmy dev only
            }
        }, 2000)
    })

    // DEV ONLY
    mobile.set(false)
    // darkMode.set(false)
    goto('') // dummmy goto homepage
</script>

<style global type="text/scss">
    @tailwind base;
    @tailwind components;
    @tailwind utilities;
    @import '../shared/style/style.scss';

    // dummy toggles
    .dummy-toggles {
        position: absolute;
        right: 5px;
        top: 5px;
        z-index: 10;
        font-size: 12px;
        display: flex;
        padding: 5px;
        background: #8080803d;
        border-radius: 10px;
        button {
            background: var(--button-bg-color);
            padding: 0 7px;
            border-radius: 10px;
            color: var(--button-text-color);
        }
    }
</style>

{#if !$isLocaleLoaded || splash}
    <Route route="">
        <Splash />
    </Route>
{:else}
    <!-- dummy toggles -->
    <div class="dummy-toggles flex flex-row">
        <div class="mr-4">
            <Toggle on={darkMode} />
        </div>
        <button on:click={() => logged.update(() => false)}> reset </button>
    </div>
    <!--  -->
    <Route route="onboarding-1">
        <Onboarding1 mobile={$mobile} locale={$_} {goto} />
    </Route>
    <Route route="legal">
        <Legal mobile={$mobile} locale={$_} {goto} />
    </Route>
    <Route route="setup">
        <Setup mobile={$mobile} locale={$_} {goto} />
    </Route>
    <Route route="password">
        <Password mobile={$mobile} locale={$_} {goto} />
    </Route>
    <Route route="protect">
        <Protect mobile={$mobile} locale={$_} {goto} />
    </Route>
    <Route route="pin">
        <Pin mobile={$mobile} locale={$_} {goto} />
    </Route>
    <Route route="confirm-pin">
        <ConfirmPin mobile={$mobile} locale={$_} {goto} />
    </Route>
    <Route route="backup">
        <Backup mobile={$mobile} locale={$_} {goto} />
    </Route>
    <Route route="recovery-phrase">
        <RecoveryPhrase mobile={$mobile} locale={$_} {goto} />
    </Route>
    <Route route="verify-recovery-phrase">
        <VerifyRecoveryPhrase mobile={$mobile} locale={$_} {goto} />
    </Route>
    <Route route="backup-recovery-phrase">
        <BackupRecoveryPhrase mobile={$mobile} locale={$_} {goto} />
    </Route>
    <Route route="recovery-phrase-saved">
        <RecoveryPhraseSaved mobile={$mobile} locale={$_} {goto} />
    </Route>
    <Route route="congratulations">
        <Congratulations mobile={$mobile} locale={$_} {goto} />
    </Route>
    <Route route="import">
        <Import mobile={$mobile} locale={$_} {goto} />
    </Route>
    <Route route="import-from-seed">
        <ImportFromSeed mobile={$mobile} locale={$_} {goto} />
    </Route>
    <Route route="import-from-seedvault">
        <ImportFromSeedVault mobile={$mobile} locale={$_} {goto} />
    </Route>
    <Route route="import-from-security-phrase">
        <ImportFromSecurityPhrase mobile={$mobile} locale={$_} {goto} />
    </Route>
    <Route route="import-from-security-phrase-file">
        <ImportFromSecurityPhraseFile mobile={$mobile} locale={$_} {goto} />
    </Route>
    <Route route="migrate">
        <Migrate mobile={$mobile} locale={$_} {goto} />
    </Route>
    <Route route="balance">
        <Balance mobile={$mobile} locale={$_} {goto} />
    </Route>
    <Route route="dashboard">
        <Dashboard mobile={$mobile} locale={$_} {goto} />
    </Route>
{/if}
