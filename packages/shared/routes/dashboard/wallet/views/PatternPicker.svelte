<script>
    import { Icon } from 'shared/components'

    export let walletPatterns
    export let selectedPattern
    export let selectedColor = 'blue'

    const patternSelection = (pattern) => {
        selectedPattern = pattern
    }
</script>

<style>
    .pattern {
        border: 3px solid transparent;
        border-radius: 6px;
        box-sizing: content-box;
    }

    .pattern:hover {
        transition: all 0.4s ease-in-out;
    }
</style>

{#each walletPatterns as pattern}
    <div class="border hover:border-{selectedColor}-200 pattern">
        <div
            class="h-14 w-16 bg-{selectedPattern === pattern ? selectedColor : ''}-500 rounded m- flex justify-center items-center colorPicker"
            on:click={() => patternSelection(pattern)}>
            {#if pattern !== '' }
                <img class="object-cover" width="100%" height="100%" src={`assets/patterns/${pattern}.svg`} alt="" />
            {/if}

            {#if selectedPattern === pattern}
                <div class="bg-green-100 h-5 w-5 rounded-2xl flex justify-center items-center z-10 absolute">
                    <Icon icon="success-check" classes="h-5  w-5 text-white" />
                </div>
            {/if}
        </div>
    </div>
{/each}
