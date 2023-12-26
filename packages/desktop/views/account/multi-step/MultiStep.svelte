<script lang="ts">
    import { AccountState } from '@contexts/account'

    const IMPLICIT_ACCOUNT_STEPS: AccountState[] = Object.values(AccountState)

    let activeState: AccountState | null = null
    let onNext: () => Promise<boolean>
    let currentStep: number = 0
    let activeComponent

    async function loadComponent() {
        activeState = IMPLICIT_ACCOUNT_STEPS[currentStep]
        const component = await import(`./${activeState}.svelte`)
        activeComponent = component.default
    }

    async function handleNext() {
        currentStep += 1
        await loadComponent()
    }

    $: loadComponent()
</script>

<section>
    {#if activeComponent}
        <svelte:component this={activeComponent} {activeState} {onNext} />
        {#if currentStep < IMPLICIT_ACCOUNT_STEPS.length - 1}
            <button on:click={handleNext}>Next</button>
        {/if}
    {/if}
</section>
