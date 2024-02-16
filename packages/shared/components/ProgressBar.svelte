<script lang="ts">
    import { Text, TextType } from '@ui'

    export let percent: number = 0
    export let message: string = ''
</script>

<progressbar-container>
    <progressbar-box>
        <progressbar style:--progress-width={`${Math.max(Math.min(percent, 100), 0)}%`} />
    </progressbar-box>
    <Text type={TextType.pre} classes="absolute bottom-0 text-12 text-gray-800 dark:text-white">
        {message}
    </Text>
</progressbar-container>

<style lang="scss">
    progressbar-container {
        @apply relative;
        @apply flex flex-col justify-center content-center items-center;
        @apply w-full;
        @apply pb-8;
    }
    progressbar-box {
        @apply relative;
        @apply w-full;
        @apply flex justify-center content-center items-center;
        @apply overflow-hidden;
        @apply border border-solid border-gray-200 dark:border-gray-800 rounded-2xl;
        @apply h-4;
        progressbar {
            @apply absolute left-0;
            @apply inline-block;
            @apply bg-blue-500;
            @apply h-4;
            @apply rounded-2xl;
            transition: width 0.25s;
            width: var(--progress-width);
        }
    }
</style>
