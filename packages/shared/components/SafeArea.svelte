<script lang="typescript">
    export let top = false
    export let right = false
    export let bottom = false
    export let left = false
    
</script>

<section class='h-full bg-white dark:bg-gray-900 {top && 'pt-safe'} {right && 'pr-safe'} {bottom && 'pb-safe'} {left && 'pl-safe'}'>
    <slot />
</section>
