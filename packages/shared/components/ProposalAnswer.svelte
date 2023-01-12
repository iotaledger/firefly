<script lang="typescript">
    import type { Answer } from '@iota/wallet'
    import { createEventDispatcher } from 'svelte'
    import { Text, FontWeight, TooltipIcon } from 'shared/components'
    import { Position } from 'shared/components/enums'
    import { appSettings } from '@core/app/stores'
    import { Icon } from '@auxiliary/icon'

    export let answer: Answer
    export let answerIndex: number = undefined
    export let disabled = false
    export let hidden: boolean = null
    export let votedAnswerValue: number = undefined
    export let selectedAnswerValue: number = undefined
    export let percentage: string = ''

    let isSelected: boolean
    let isVotedFor: boolean

    $: selectedAnswerValue, votedAnswerValue, setIsSelected()
    $: votedAnswerValue, setIsVotedFor()
    $: dark = $appSettings.darkMode

    const dispatch = createEventDispatcher()

    function handleClick(): void {
        if (!disabled) {
            dispatch('click')
        }
    }

    function setIsSelected(): void {
        if (selectedAnswerValue === answer?.value) {
            isSelected = true
        } else if (selectedAnswerValue === undefined && votedAnswerValue === answer?.value) {
            isSelected = true
        } else {
            isSelected = false
        }
    }

    function setIsVotedFor(): void {
        isVotedFor = votedAnswerValue === answer?.value
    }
</script>

<proposal-answer
    style:--percentage={percentage}
    class:hidden={isVotedFor ? false : hidden}
    class:is-voted-for={isVotedFor}
    class:dark
    class="flex justify-between items-center p-3 rounded-md border border-solid relative dark:bg-gray-900
        {isSelected ? 'border-blue-500' : 'border-gray-200 dark:border-transparent'}
        {disabled ? 'cursor-default' : 'cursor-pointer'}
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
                        : 'bg-white dark:bg-gray-900 text-gray-500'} text-700 border border-solid border-gray-200 dark:border-gray-800"
                >
                    {answerIndex + 1}
                </span>
            {/if}
        {/if}
        <Text fontWeight={FontWeight.medium}>{answer.text}</Text>
    </div>
    <div class="flex items-center space-x-1.5">
        {#if percentage}
            <div>
                <Text
                    smaller
                    fontWeight={FontWeight.medium}
                    classes="ml-auto text-gray-700 dark:text-gray-500"
                    overrideColor
                >
                    {percentage}
                </Text>
            </div>
        {/if}
        <div class="flex justify-center items-center w-3 h-3">
            {#if answer.additionalInfo}
                <TooltipIcon
                    icon={Icon.Info}
                    iconClasses="text-gray-600 dark:text-gray-500"
                    text={answer.additionalInfo}
                    position={Position.Left}
                    width={13}
                    height={13}
                />
            {/if}
        </div>
    </div>
</proposal-answer>

<style type="text/scss">
    proposal-answer {
        > * {
            z-index: 2;
        }

        &::after {
            @apply -ml-3;
            @apply absolute;
            @apply bg-gray-100;
            @apply h-full;
            @apply inline-block;
            @apply mr-auto;
            @apply rounded-l-md;
            @apply z-10;
            content: '';
            width: var(--percentage);
            z-index: 1;
        }

        &.is-voted-for::after {
            @apply bg-blue-100;
        }

        &.dark::after {
            @apply bg-gray-1000;
        }
    }

    .ring {
        @apply ring-4;
        @apply ring-blue-500;
        @apply ring-opacity-20;
    }
</style>
