<script lang="ts">
    import type { Answer } from '@iota/wallet'
    import { Text, FontWeight, TooltipIcon, PingingBadge, Icon } from 'shared/components'
    import { Position } from 'shared/components/enums'
    import { appSettings } from '@core/app/stores'
    import { Icon as IconEnum } from '@auxiliary/icon'
    import { ProposalStatus } from '@contexts/governance'

    export let onAnswerClick: () => void

    export let answer: Answer
    export let answerIndex: number = undefined
    export let votedAnswerValue: number = undefined
    export let selectedAnswerValue: number = undefined
    export let percentage: string = ''
    export let disabled = false
    export let hidden: boolean = null
    export let isWinner: boolean
    export let proposalStatus: string
    export let truncate = false

    let isSelected: boolean
    let isVotedFor: boolean

    $: selectedAnswerValue, votedAnswerValue, setIsSelected()
    $: isVotedFor = votedAnswerValue === answer?.value
    $: dark = $appSettings.darkMode

    function onClick(): void {
        if (!disabled && !hidden) {
            onAnswerClick()
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
</script>

<proposal-answer
    class:dark
    class:disabled
    class:hidden={isSelected || isWinner ? false : hidden}
    class:voted={isVotedFor}
    class:winner={isWinner}
    class:selected={isSelected}
    style:--percentage={percentage}
    on:click={onClick}
>
    <div class="flex space-x-3 items-center w-full min-w-0">
        {#if answerIndex !== undefined}
            {#if isVotedFor}
                <status-icon class="flex justify-center items-center w-5 h-5">
                    {#if proposalStatus === ProposalStatus.Ended}
                        <Icon icon={IconEnum.Voted} width={20} height={20} />
                    {:else if proposalStatus === ProposalStatus.Commencing}
                        <Icon icon={IconEnum.History} width={20} height={20} />
                    {:else if proposalStatus === ProposalStatus.Holding}
                        <PingingBadge classes="relative" />
                    {/if}
                </status-icon>
            {:else}
                <answer-index>{answerIndex + 1}</answer-index>
            {/if}
        {/if}
        <Text fontWeight={FontWeight.medium} classes="w-full {truncate ? 'truncate' : ''}">{answer.text}</Text>
    </div>
    <div class="flex items-center space-x-1.5">
        {#if isWinner}
            <Icon icon={IconEnum.Trophy} />
        {/if}
        {#if percentage}
            <Text
                smaller
                fontWeight={FontWeight.medium}
                classes="h-3 ml-auto text-gray-700 dark:text-gray-500"
                overrideColor
            >
                {percentage}
            </Text>
        {/if}
        {#if answer.additionalInfo}
            <TooltipIcon
                icon={IconEnum.Info}
                classes="w-3 h-3"
                iconClasses="text-gray-600 dark:text-gray-500"
                text={answer.additionalInfo}
                position={Position.Left}
                width={12}
                height={12}
            />
        {/if}
    </div>
</proposal-answer>

<style type="text/scss">
    proposal-answer {
        @apply border-solid;
        @apply border;
        @apply border-gray-200;
        @apply items-center;
        @apply justify-between;
        @apply p-3;
        @apply relative;
        @apply rounded-md;

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

        &:not(.disabled):hover {
            @apply border-blue-500;
        }

        &:not(.hidden) {
            @apply flex;
        }

        &:not(.winner) status-icon :global(svg) {
            @apply text-blue-500;
        }

        &.selected {
            @apply border-blue-500;

            answer-index {
                @apply bg-blue-500;
                @apply text-white;
            }
        }

        &.voted {
            &:hover {
                @apply bg-blue-50;
            }

            &::after {
                @apply bg-blue-100;
            }
        }

        &.winner {
            @apply bg-blue-500;

            &::after {
                @apply bg-blue-600;
            }

            answer-index {
                @apply bg-blue-600;
                @apply text-white;
            }

            :global(*) {
                @apply text-white;
            }
        }

        &.dark:not(.selected) {
            @apply border-transparent;
        }

        &.dark:not(.winner) {
            @apply bg-gray-900;

            &::after {
                @apply bg-gray-1000;
            }

            answer-index {
                @apply bg-gray-900;
                @apply border-gray-800;
            }
        }

        &.disabled {
            @apply cursor-default;
        }

        answer-index {
            @apply bg-white;
            @apply border-gray-200;
            @apply border-solid;
            @apply border;
            @apply flex;
            @apply font-bold;
            @apply h-5;
            @apply items-center;
            @apply justify-center;
            @apply text-12;
            @apply text-gray-500;
            @apply w-5;
        }
    }
</style>
