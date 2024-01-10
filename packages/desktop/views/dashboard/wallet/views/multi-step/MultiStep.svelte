<script lang="ts">
    import { ImplicitAccountCreationState } from '@contexts/implicit-account-creation'

    const IMPLICIT_ACCOUNT_STEPS: ImplicitAccountCreationState[] = Object.values(ImplicitAccountCreationState)

    let activeState: ImplicitAccountCreationState | null = null
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

{#if activeComponent}
    <svelte:component this={activeComponent} {activeState} {onNext} />
    <!-- TODO: Remove this button, it's just to allow go to next step -->
    {#if currentStep < IMPLICIT_ACCOUNT_STEPS.length - 1}
        <button on:click={handleNext}>Next</button>
    {/if}
    <!-- Dots to show progress -->
    <div class="flex flex-row justify-center space-x-2.5">
        {#each IMPLICIT_ACCOUNT_STEPS as step, index}
            <div class="w-2.5 h-2.5 rounded-full {activeState === step ? 'bg-blue-500' : 'bg-blue-200'}" />
        {/each}
    </div>
{/if}
