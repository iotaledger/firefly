<script lang="typescript">
    import { Text, FontWeight, Icon } from 'shared/components'
    import { Icon as IconEnum } from '@auxiliary/icon'
    import { Answer } from '@core/governance/interfaces'
    import { createEventDispatcher } from 'svelte'

    export let answer: Answer
    export let hidden = null
    export let isSelected = null
    export let answerIndex: number = undefined

    const dispatch = createEventDispatcher()

    function handleClick(): void {
        dispatch('answerClicked', answerIndex)
    }
</script>

<proposal-answer
    class:hidden
    class="flex justify-between items-center p-3 rounded-md border border-solid {isSelected
        ? 'border-blue-500'
        : 'border-gray-200'} "
    on:click={handleClick}
>
    <div class="flex space-x-3">
        {#if answerIndex !== undefined}
            <span
                class="flex items-center justify-center h-5 w-5 text-12 {isSelected
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-500'} text-700 border border-solid border-gray-200"
            >
                {answerIndex + 1}
            </span>
        {/if}
        <Text fontWeight={FontWeight.medium}>{answer.text}</Text>
    </div>
    <Icon icon={IconEnum.Info} width={10} height={10} classes="text-gray-600" />
</proposal-answer>
