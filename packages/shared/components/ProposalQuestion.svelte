<script lang="typescript">
    import type { AnswerStatus, Question } from '@iota/wallet'
    import { createEventDispatcher } from 'svelte'
    import { Text, FontWeight, Icon, ProposalAnswer } from 'shared/components'
    import { ProposalStatus, selectedProposal } from '@contexts/governance'
    import { Icon as IconEnum } from '@auxiliary/icon'

    const dispatch = createEventDispatcher()

    export let allVotes: AnswerStatus[] = undefined
    export let questionIndex: number = undefined
    export let isOpened = false
    export let question: Question
    export let selectedAnswerValue: number = undefined
    export let votedAnswerValue: number = undefined

    let percentages: string[]

    $: answers = [...question?.answers, { value: 0, text: 'Abstain', additionalInfo: '' }]
    $: showMargin = isOpened || ((votedAnswerValue || votedAnswerValue === 0) && !isOpened) // votedAnswerValue 0 corresponds to abstained vote
    $: allVotes, setPercentagesFromAccumulated()
    $: disabled =
        $selectedProposal.status === ProposalStatus.Upcoming || $selectedProposal.status === ProposalStatus.Ended

    function setPercentagesFromAccumulated(): void {
        const totalAccumulated = allVotes?.reduce((acc, answer) => acc + answer.accumulated, 0)
        percentages = answers?.map((currentAnswer) => {
            const answerAccumulated = allVotes?.find((answer) => answer.value === currentAnswer.value)?.accumulated
            const divisionResult = answerAccumulated / totalAccumulated
            return Number.isNaN(divisionResult) ? '0%' : `${Math.round(divisionResult * 100)}%`
        })
    }

    function handleAnswerClick(answerValue: number): void {
        dispatch('clickAnswer', { answerValue, questionIndex })
    }

    function handleQuestionClick(): void {
        dispatch('clickQuestion', { questionIndex })
    }
</script>

<proposal-question
    class="flex flex-col px-5 py-4 rounded-xl border border-solid border-gray-200 dark:border-transparent dark:bg-gray-850 cursor-pointer"
>
    <div on:click={handleQuestionClick} class="flex justify-between items-center">
        <div class="flex flex-col">
            {#if questionIndex !== undefined}
                <Text smaller fontWeight={FontWeight.bold} overrideColor classes="mb-1 text-blue-500">
                    Question {questionIndex + 1}
                </Text>
            {/if}
            <Text fontWeight={FontWeight.bold} overrideColor classes="text-gray-900 dark:text-white">
                {question.text}
            </Text>
        </div>
        <div class="transform {isOpened ? 'rotate-180' : 'rotate-0'}">
            <Icon icon={IconEnum.ChevronDown} classes="text-gray-500" />
        </div>
    </div>
    <proposal-answers class:mt-4={showMargin} class={isOpened ? 'space-y-2' : ''}>
        {#each answers as answer, answerIndex}
            <ProposalAnswer
                {answer}
                {answerIndex}
                {votedAnswerValue}
                {selectedAnswerValue}
                {disabled}
                hidden={!isOpened}
                percentage={percentages[answerIndex]}
                on:click={handleAnswerClick(answer?.value)}
            />
        {/each}
    </proposal-answers>
</proposal-question>
