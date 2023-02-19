<script lang="ts">
    import { needsToAcceptLatestPrivacyPolicy, needsToAcceptLatestTermsOfService } from '@core/app'
    import { EnterPinView, SelectProfileView, LegalUpdateView, LoadProfileView } from './views'
    import { loginRoute, LoginRoute } from '../../lib/routers'
    import { onMount } from 'svelte'

    $: needsToAcceptLegal = false

    function checkLegal(): void {
        needsToAcceptLegal = needsToAcceptLatestPrivacyPolicy() || needsToAcceptLatestTermsOfService()
    }

    onMount(() => {
        checkLegal()
    })
</script>

{#if needsToAcceptLegal}
    <LegalUpdateView onAccept={checkLegal} />
{:else if $loginRoute === LoginRoute.SelectProfile}
    <SelectProfileView />
{:else if $loginRoute === LoginRoute.EnterPin}
    <EnterPinView />
{:else if $loginRoute === LoginRoute.LoadProfile}
    <LoadProfileView />
{/if}
