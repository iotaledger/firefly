<script lang="ts">
    import { onMount } from 'svelte'
    import { needsToAcceptLatestPrivacyPolicy, needsToAcceptLatestTermsOfService } from '@core/app'
    import { loginRoute, LoginRoute } from '@/routers'
    import { EnterPinView, LegalUpdateView, LoadProfileView, SelectProfileView } from './views'

    let needsToAcceptLegal = false

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
