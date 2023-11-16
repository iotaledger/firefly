<script lang="ts">
    import { Icon } from '@ui'

    export let boxClasses: string | undefined = undefined
</script>

<div class="rounded-10 w-8 h-8 flex justify-center items-center {boxClasses ?? ''}">
    <Icon {...$$props} />
</div>
