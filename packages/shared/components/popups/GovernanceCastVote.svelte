<script lang="typescript">
    import { Text, Button } from 'shared/components'
    import { localize } from 'shared/lib/i18n'
    import { closePopup } from 'shared/lib/popup'
    import { isSoftwareProfile } from 'shared/lib/profile';
    import { selectedAccountId, api } from 'shared/lib/wallet';
    import { participate } from 'shared/lib/participation/api';
    import { showAppNotification } from 'shared/lib/notifications'
    import { openPopup } from 'shared/lib/popup'
    import type { VotingEventAnswer } from 'shared/lib/participation/types';
    import type { Locale } from 'shared/lib/typings/i18n';
    
    export let locale: Locale
    export let answer: VotingEventAnswer
    export let eventId: string

    const castVote = async () => {
        try {
            await participate($selectedAccountId, [{ eventId, answers: [answer?.value] }])
        } catch (err) {
            showAppNotification({
                type: 'error',
                message: locale(err.error),
            })
        }
    }
    
    const handleCastClick = () => {
        if ($isSoftwareProfile) {
            api.getStrongholdStatus({
                onSuccess(strongholdStatusResponse) {
                    if (strongholdStatusResponse.payload.snapshot.status === 'Locked') {
                        openPopup({
                            type: 'password',
                            props: {
                                onSuccess: () => castVote(),
                            },
                        })
                    } else {
                        void castVote()
                    }
                },
                onError(err) {
                    showAppNotification({
                        type: 'error',
                        message: locale(err.error),
                    })
                },
            })
        } else {
            void castVote()
        }
    }
</script>

<div>
    <Text type="h3" classes="mb-8">{answer?.text}</Text>
    <Text type="p" classes="mb-5">{answer?.additionalInfo}</Text>
    <div class="flex justify-between space-x-2">
        <Button secondary classes="mb-0 w-full block text-15" onClick={closePopup}>{localize('actions.cancel')}</Button>
        <Button classes="mb-0 w-full block text-15" onClick={handleCastClick}>{localize('actions.castVotes')}</Button>
    </div>
</div>
