<script lang="ts">
    import { Text, TextType } from 'shared/components'

    export let percent: number = 0
    export let message: string = ''
</script>

<progressbar-container class="relative flex flex-col justify-center content-center items-center w-full pb-8">
    <progressbar-box
        class="relative w-full flex justify-center content-center items-center overflow-hidden border border-solid border-gray-200 dark:border-gray-800 h-4 rounded-2xl"
    >
        <progressbar style:--progress-width={`${Math.max(Math.min(percent, 100), 0)}%`} />
    </progressbar-box>
    <Text type={TextType.pre} class="absolute bottom-0 text-12 text-gray-800 dark:text-white">
        {message}
    </Text>
</progressbar-container>

<style lang="scss">
    progressbar {
        @apply absolute left-0;
        @apply inline-block;
        @apply bg-blue-500;
        @apply h-4;
        @apply rounded-2xl;
        transition: width 0.25s;
        width: var(--progress-width);
    }
</style>
