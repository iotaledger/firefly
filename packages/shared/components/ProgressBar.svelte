<script lang="ts">
    import { Text } from 'shared/components'

    export let percent = 0
    export let classes = ''
    export let message = ''
</script>

<div class="relative flex flex-col justify-center content-center items-center w-full pb-8">
    <div
        class="relative w-full flex justify-center content-center items-center overflow-hidden border border-solid border-gray-200 dark:border-gray-800 h-4 rounded-2xl {classes}"
    >
        <span
            class="absolute left-0 inline-block bg-blue-500 h-4 rounded-2xl progress"
            style={`width:${Math.max(Math.min(percent, 100), 0)}%`}
        />
    </div>
    <Text type="pre" class="absolute bottom-0 text-12 text-gray-800 dark:text-white">
        {message}
    </Text>
</div>

<style lang="scss">
    .progress {
        transition: width 0.25s;
    }
</style>
