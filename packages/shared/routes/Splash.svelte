<script lang="typescript">
    import { onMount } from 'svelte'
    import { Animation } from 'shared/components'
    import { pollChrysalisSnapshot } from 'shared/lib/migration'

    onMount(() => {
        pollChrysalisSnapshot()
    })
</script>

<div class="w-full h-full flex justify-center items-center bg-white dark:bg-gray-900">
    <div class="w-1/3">
        <Animation classes="w-full h-auto" animation="splashscreen-desktop" loop={false} renderer="canvas" />
    </div>
</div>
