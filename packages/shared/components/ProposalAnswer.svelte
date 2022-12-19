<script lang="typescript">
    import { createEventDispatcher } from 'svelte'
    import { Text, FontWeight, TooltipIcon } from 'shared/components'
    import { Position } from 'shared/components/enums'
    import type { Answer } from '@iota/wallet'
    import { Icon as IconEnum } from '@auxiliary/icon'

    export let answer: Answer
    export let hidden: boolean = null
    export let isSelected: boolean = null
    export let isVotedFor: boolean = null
    export let answerIndex: number = undefined

    $: showBorder = isVotedFor || isSelected

    const dispatch = createEventDispatcher()

    function handleClick(): void {
        dispatch('answerClicked', answer?.value)
    }
</script>

<proposal-answer
    class:hidden={isVotedFor ? false : hidden}
    class="flex justify-between items-center p-3 rounded-md border border-solid
        {isVotedFor ? 'bg-blue-100' : ''}
        {showBorder ? 'border-blue-500' : 'border-gray-200'}
    "
    on:click={handleClick}
>
    <div class="flex space-x-3 items-center">
        {#if answerIndex !== undefined}
            {#if isVotedFor}
                <div class="flex justify-center w-5">
                    <span class="ring flex items-center justify-center h-1.5 w-1.5 bg-blue-500 rounded-full" />
                </div>
            {:else}
                <span
                    class="flex items-center justify-center h-5 w-5 text-12 {isSelected
                        ? 'bg-blue-500 text-white'
                        : 'text-gray-500'} text-700 border border-solid border-gray-200"
                >
                    {answerIndex + 1}
                </span>
            {/if}
        {/if}
        <Text fontWeight={FontWeight.medium}>{answer.text}</Text>
    </div>
    {#if answer.additionalInfo}
        <TooltipIcon
            icon={IconEnum.Info}
            iconClasses="text-gray-600 dark:text-gray-200"
            text={answer.additionalInfo}
            position={Position.Left}
            width={10}
            height={10}
        />
    {/if}
</proposal-answer>

<style type="text/scss">
    .ring {
        @apply ring-4;
        @apply ring-blue-500;
        @apply ring-opacity-20;
    }
</style>
