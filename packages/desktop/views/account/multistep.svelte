<script lang="ts">
    import { AccountState } from '@contexts/account'

    const steps: AccountState[] = Object.values(AccountState)

    let activeState: AccountState | null = null
    let onNext: () => Promise<boolean>
    let currentStep: number = 0
    let activeComponent

    async function loadComponent() {
        activeState = steps[currentStep]
        const component = await import(`./multistep/${activeState}.svelte`)
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
        {#if currentStep < steps.length - 1}
            <button on:click={handleNext}>Next</button>
        {/if}
    {/if}
</section>
