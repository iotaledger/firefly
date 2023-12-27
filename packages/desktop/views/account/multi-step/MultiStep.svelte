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

{#if activeComponent}
    <svelte:component this={activeComponent} {activeState} {onNext} />
    <!-- Dots to show progress -->
    <div class="flex flex-row justify-center space-x-2.5">
        {#each IMPLICIT_ACCOUNT_STEPS as step, index}
            <!-- TODO: Remove onClick from div, it's just to allow continue to next step -->
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <div
                on:click={handleNext}
                class="w-2.5 h-2.5 rounded-full {activeState === step ? 'bg-blue-500' : 'bg-blue-200'}"
            />
        {/each}
    </div>
{/if}
