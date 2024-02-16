<script lang="ts">
    import { Button, FontWeight, Text, TextType } from '@ui'
    import { localize } from '@core/i18n'
    import { implicitAccountCreationRouter, ImplicitAccountCreationRoute } from '@core/router'

    interface IStep {
        title: string
        description: string
        image: string
    }

    const NUMBER_OF_STEPS = Object.keys(ImplicitAccountCreationRoute).slice(1).length
    const MAIN_VIEW_STEPS: IStep[] = new Array(NUMBER_OF_STEPS).fill(null).map((_, index) => {
        const stepNumber = index + 1
        return {
            title: localize(`views.implicit-account-creation.steps.step${stepNumber}.title`),
            description: localize(`views.implicit-account-creation.steps.step${stepNumber}.body`),
            image: `assets/illustrations/implicit-account-creation/step${stepNumber}.svg`,
        }
    })

    function onContinueClick(): void {
        $implicitAccountCreationRouter.next()
    }
</script>

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
<Button onClick={onContinueClick}>{localize('views.implicit-account-creation.action')}</Button>
