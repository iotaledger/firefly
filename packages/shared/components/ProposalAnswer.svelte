<script lang="typescript">
    import { Text, FontWeight, Icon } from 'shared/components'
    import { Icon as IconEnum } from '@auxiliary/icon'

    interface Answer {
        value: number
        text: string
        additionalInfo: string
    }

    export let answer: Answer
    export let hidden = null
    export let index: number = undefined
</script>

<proposal-answer
    class:hidden
    class="flex justify-between items-center p-3 rounded-md border border-solid border-gray-200"
>
    <div class="flex space-x-3">
        {#if index !== undefined}
            <span
                class="flex items-center justify-center h-5 w-5 text-12 text-700 text-gray-500 border border-solid border-gray-200"
            >
                {index + 1}
            </span>
        {/if}
        <Text fontWeight={FontWeight.medium}>{answer.text}</Text>
    </div>
    <Icon icon={IconEnum.Info} width={10} height={10} classes="text-gray-600" />
</proposal-answer>
