<script lang="ts">
    import { Text, Video } from 'shared/components'

    export let title
    export let video
</script>

<div class="mb-5">
    <Text type="h4">{title}</Text>
</div>
<div class="w-full h-auto">
    <Video {video} />
</div>
