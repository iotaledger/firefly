<script lang="typescript">
    import { Text, FontWeight, Icon, ProposalAnswer } from 'shared/components'
    import { Icon as IconEnum } from '@auxiliary/icon'
    import type { Answer, AnswerStatus, Question } from '@iota/wallet'
    import { createEventDispatcher } from 'svelte'

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

    function setPercentagesFromAccumulated(): void {
        const totalAccumulated = allVotes?.reduce((acc, answer) => acc + answer.accumulated, 0)
        percentages = answers?.map((currentAnswer) => {
            const answerAccumulated = allVotes?.find((answer) => answer.value === currentAnswer.value)?.accumulated
            const divisionResult = answerAccumulated / totalAccumulated
            return Number.isNaN(divisionResult) ? '0%' : `${Math.round(divisionResult * 100)}%`
        })
    }

    function handleAnswerClick(answerValue: number): void {
        dispatch('clickedAnswer', { answerValue, questionIndex })
    }

    function handleQuestionClick(): void {
        dispatch('clickedQuestion', { questionIndex })
    }

    function isAnswerSelected(answer: Answer): boolean {
        if (selectedAnswerValue === answer?.value) {
            return true
        } else if (selectedAnswerValue === undefined && votedAnswerValue === answer?.value) {
            return true
        } else {
            return false
        }
    }
</script>

<proposal-question class="flex flex-col px-5 py-4 rounded-xl border border-solid border-gray-200 cursor-pointer">
    <div on:click={handleQuestionClick} class="flex justify-between items-center">
        <div class="flex flex-col">
            {#if questionIndex !== undefined}
                <Text smaller fontWeight={FontWeight.bold} overrideColor classes="mb-1 text-blue-500">
                    Question {questionIndex + 1}
                </Text>
            {/if}
            <Text fontWeight={FontWeight.bold} overrideColor classes="text-gray-900">{question.text}</Text>
        </div>
        <div class="transform {isOpened ? 'rotate-180' : 'rotate-0'}">
            <Icon icon={IconEnum.ChevronDown} classes="text-gray-500" />
        </div>
    </div>
    <proposal-answers class:mt-4={showMargin} class={isOpened ? 'space-y-2' : ''}>
        {#key selectedAnswerValue}
            {#each answers as answer, answerIndex}
                <ProposalAnswer
                    {answer}
                    {answerIndex}
                    on:clicked={handleAnswerClick(answer?.value)}
                    hidden={!isOpened}
                    isSelected={isAnswerSelected(answer)}
                    isVotedFor={votedAnswerValue === answer?.value}
                    percentage={percentages[answerIndex]}
                />
            {/each}
        {/key}
    </proposal-answers>
</proposal-question>
