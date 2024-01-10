<script lang="ts">
    import { Button, FontWeight, Text, TextType } from 'shared/components'
    import { MultiStep } from './multi-step'
    import { localize } from '@core/i18n'

    interface IStep {
        title: string
        description: string
        image: string
    }

    const NUMBER_OF_STEPS = Object.keys(localize('views.implicit-account-creation.steps')).length
    const MAIN_VIEW_STEPS: IStep[] = new Array(NUMBER_OF_STEPS).fill(null).map((_, index) => {
        const stepNumber = index + 1
        return {
            title: localize(`views.implicit-account-creation.steps.step${stepNumber}.title`),
            description: localize(`views.implicit-account-creation.steps.step${stepNumber}.body`),
            image: `assets/illustrations/implicit-account-creation/step${stepNumber}.svg`,
        }
    })

    let startProccess = false

    function startMultiStepProccess(): void {
        startProccess = true
    }
</script>

<section class="flex flex-col w-full h-full pt-5 px-60 pb-12 items-center justify-between">
    <box-content class="flex flex-col w-full h-full pt-9 px-8 items-center justify-between rounded-2xl">
        <Text type={TextType.h2}>{localize('views.implicit-account-creation.title')}</Text>
        {#if !startProccess}
            <steps-wrapper class="flex space-x-4">
                {#each MAIN_VIEW_STEPS as step}
                    <step-content class="flex flex-col items-center space-y-8">
                        <img src={step.image} alt={step.title} />
                        <div class="flex flex-col text-center px-4 space-y-2">
                            <Text
                                type={TextType.h5}
                                fontSize="15"
                                color="blue-700"
                                darkColor="blue-700"
                                fontWeight={FontWeight.semibold}>{step.title}</Text
                            >
                            <Text type={TextType.h3} fontWeight={FontWeight.semibold}>{step.description}</Text>
                        </div>
                    </step-content>
                {/each}
            </steps-wrapper>
            <Button onClick={startMultiStepProccess} classes="mb-12"
                >{localize('views.implicit-account-creation.action')}</Button
            >
        {:else}
            <MultiStep />
        {/if}
    </box-content>
</section>

<style lang="scss">
    box-content {
        box-shadow: 0px 1px 4px 0px rgba(23, 27, 37, 0.04);
    }
</style>
