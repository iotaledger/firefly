<script lang="typescript">
    import { Animation } from 'shared/components'
    import { mobile } from 'shared/lib/app'
    import { pollChrysalisSnapshot } from 'shared/lib/migration'
    import { onMount } from 'svelte'

    onMount(() => {
        void pollChrysalisSnapshot()
    })
</script>

<div class="w-full h-full flex justify-center items-center bg-white dark:bg-gray-900">
    <div class={$mobile ? 'w-full px-4' : 'w-1/3'}>
        <Animation classes="w-full h-auto" animation="splashscreen-desktop" loop={false} renderer="canvas" />
    </div>
</div>
