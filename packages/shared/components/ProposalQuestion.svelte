<script lang="typescript">
    import type { AnswerStatus, Question } from '@iota/wallet'
    import { createEventDispatcher } from 'svelte'
    import { Text, FontWeight, Icon, ProposalAnswer, TooltipIcon } from 'shared/components'
    import { ABSTAIN_VOTE_VALUE } from '@contexts/governance/constants'
    import { ProposalStatus } from '@contexts/governance/enums'
    import { selectedProposal } from '@contexts/governance/stores'
    import { Icon as IconEnum } from '@auxiliary/icon'
    import { Position } from './enums'
    import { getPercentagesFromAnswerStatuses, IProposalAnswerPercentages } from '@contexts/governance'

    const dispatch = createEventDispatcher()

    export let answerStatuses: AnswerStatus[] = []
    export let questionIndex: number = undefined
    export let isOpened = false
    export let question: Question
    export let selectedAnswerValue: number = undefined
    export let votedAnswerValue: number = undefined

    let percentages: IProposalAnswerPercentages = {}
    let winnerAnswerIndex: number

    $: answers = [...question?.answers, { value: 0, text: 'Abstain', additionalInfo: '' }]
    $: percentages = getPercentagesFromAnswerStatuses(answerStatuses)
    $: disabled =
        $selectedProposal.state.status === ProposalStatus.Upcoming ||
        $selectedProposal.state.status === ProposalStatus.Ended
    $: answerStatuses, setWinnerAnswerIndex()
    $: showMargin =
        isOpened ||
        ((votedAnswerValue || votedAnswerValue === ABSTAIN_VOTE_VALUE) && !isOpened) ||
        ((selectedAnswerValue || selectedAnswerValue === ABSTAIN_VOTE_VALUE) && !isOpened) ||
        winnerAnswerIndex !== undefined

    function handleAnswerClick(answerValue: number): void {
        dispatch('clickAnswer', { answerValue, questionIndex })
    }

    function handleQuestionClick(): void {
        dispatch('clickQuestion', { questionIndex })
    }

    function setWinnerAnswerIndex(): void {
        if ($selectedProposal.state.status === ProposalStatus.Ended) {
            const answersAccumulated = answerStatuses?.map((answer) => answer.accumulated)
            const maxAccumulated = Math.max(...answersAccumulated)
            winnerAnswerIndex = answersAccumulated?.indexOf(maxAccumulated)
        }
    }
</script>

<proposal-question
    class="flex flex-col px-5 py-4 rounded-xl border border-solid border-gray-200 dark:border-transparent dark:bg-gray-850 cursor-pointer"
>
    <div on:click={handleQuestionClick} class="flex justify-between items-center">
        <div class="flex flex-col min-w-0">
            {#if questionIndex !== undefined}
                <Text smaller fontWeight={FontWeight.bold} overrideColor classes="mb-1 text-blue-500">
                    Question {questionIndex + 1}
                </Text>
            {/if}
            <div class="flex flex-row space-x-1.5 items-center">
                <Text
                    fontWeight={FontWeight.bold}
                    overrideColor
                    classes="text-gray-900 dark:text-white {isOpened ? '' : 'truncate'}"
                >
                    {question.text}
                </Text>
                {#if question.additionalInfo}
                    <TooltipIcon
                        iconClasses="text-gray-600 dark:text-gray-500"
                        text={question.additionalInfo}
                        position={Position.Bottom}
                        width={13}
                        height={13}
                    />
                {/if}
            </div>
        </div>
        <Icon icon={IconEnum.ChevronDown} classes="text-gray-500 transform {isOpened ? 'rotate-180' : 'rotate-0'}" />
    </div>
    <proposal-answers class:mt-4={showMargin} class="flex flex-col gap-2">
        {#each answers as answer, answerIndex}
            <ProposalAnswer
                {answer}
                {answerIndex}
                {votedAnswerValue}
                {selectedAnswerValue}
                {disabled}
                hidden={!isOpened}
                percentage={percentages[answer.value]}
                isWinner={answerIndex === winnerAnswerIndex}
                proposalStatus={$selectedProposal.state?.status}
                truncate={!isOpened}
                on:click={handleAnswerClick(answer.value)}
            />
        {/each}
    </proposal-answers>
</proposal-question>
