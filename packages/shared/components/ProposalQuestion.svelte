<script lang="typescript">
    import { Text, FontWeight, Icon, ProposalAnswer } from 'shared/components'
    import { Icon as IconEnum } from '@auxiliary/icon'
    import { Question } from '@core/governance/interfaces'

    export let question: Question
    export let index: number = undefined
    export let selectedIndices: number[] // TODO, maybe should be a svelte store
    export let isOpened = false

    export let onClick: () => unknown = () => {}

    function handleAnswerClick(answerIndex: number): void {
        selectedIndices[index] = answerIndex
    }
</script>

<proposal-question class="flex flex-col px-5 py-4 rounded-xl border border-solid border-gray-200 cursor-pointer">
    <div on:click={onClick} class="flex justify-between items-center">
        <div class="flex flex-col">
            {#if index !== undefined}
                <Text smaller fontWeight={FontWeight.bold} overrideColor classes="mb-1 text-blue-500"
                    >Question {index + 1}</Text
                >
            {/if}
            <Text fontWeight={FontWeight.bold} overrideColor classes="text-gray-900">{question.text}</Text>
        </div>
        <div class="transform {isOpened ? 'rotate-180' : 'rotate-0'}">
            <Icon icon={IconEnum.ChevronDown} classes="text-gray-500" />
        </div>
    </div>
    <proposal-answers class:mt-4={isOpened} class="space-y-2">
        {#each question.answers as answer, answerIndex}
            <ProposalAnswer
                {answer}
                {answerIndex}
                on:answerClicked={() => handleAnswerClick(answerIndex)}
                hidden={!isOpened}
                isSelected={selectedIndices[index] === answerIndex}
            />
        {/each}
    </proposal-answers>
</proposal-question>
