<script lang="typescript">
    import { Text, Button, Illustration } from 'shared/components'
    import { localize } from 'shared/lib/i18n'
    import { GovernanceRoutes } from 'shared/lib/typings/routes'
    import { governanceRoute } from 'shared/lib/router'
    import type { ParticipationEvent } from 'shared/lib/participation/types'

    export let event: ParticipationEvent

    const handleButtonClick = () => governanceRoute.set(GovernanceRoutes.EventDetails)
</script>

<Illustration illustration="treasury-bg" classes="w-full bg-lightblue-200 rounded-2xl" />
<Text
    type="p"
    classes="bg-white dark:bg-gray-800 text-14 px-4 py-2 rounded-2xl text-blue-500 uppercase w-fit -mt-4 mb-2"
    overrideColor
    bold
    smaller
>
    {localize(`views.governance.events.status.${event?.status?.status}`)}
</Text>
<Text type="h2" classes="text-gray-800 dark:text-white mb-2" overrideColor>{event?.information?.name}</Text>
<Text
    type="p"
    classes="text-gray-700 dark:text-gray-500 mb-2 mx-16 text-14 text-center min-w-0 overflow-auto"
    overrideColor
    >{event?.information?.additionalInfo}
</Text>
<Button classes="w-1/4 mt-auto" onClick={handleButtonClick} disabled={!event} small
    ><Text type="p" overrideColor bold classes="text-white">{localize('views.governance.events.button')}</Text></Button
>
