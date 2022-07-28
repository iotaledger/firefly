<script lang="typescript">
    import { fade } from 'svelte/transition'
    import { Toast } from 'shared/components'
    import { mobile } from '@lib/app'
    import { displayNotifications, removeDisplayNotification } from '@lib/notifications'
    import { slidable } from '@lib/actions'
    import { NotificationData } from '@lib/typings/notification'
    import { tweened } from 'svelte/motion'
    import { quintOut } from 'svelte/easing'

    let toasts: NotificationData[]
    $: toasts = $displayNotifications.map((notification) => ({
        ...notification,
        actions: notification.actions.map((action, actionIndex) => ({
            ...action,
            onClick: () => action.callback(notification, actionIndex),
        })),
    }))

    const positionX = tweened(0, { duration: 350, easing: quintOut })
    let isVelocityReached: boolean = false
    let touchStartX: number = null
    let selectedToastId: string
    let toastElement: HTMLElement

    $: {
        if (toastElement) {
            toastElement.style.transform = `translateX(${$positionX}px)`
            switch ($positionX) {
                case -window.innerWidth:
                case window.innerWidth * 2:
                    toasts.filter((toast) => toast.id !== selectedToastId) // Remove toast manually because store update reactivity is too slow
                    removeDisplayNotification(selectedToastId)
                    selectedToastId = null
                    toastElement = null
                    touchStartX = null
                    positionX.update(() => 0)
                    break
                case 0:
                    touchStartX = null
                    break
            }
        }
    }

    $: $positionX, handleOpacity()

    function handleSlideMove(event: CustomEvent, id: string): void {
        toastElement = event.target as HTMLElement
        selectedToastId = id
        touchStartX ?? (touchStartX = event.detail.x)
        positionX.update(() => event.detail.x - touchStartX)
        handleVelocity(event)
    }

    function handleSlideEnd(): void {
        if (isVelocityReached) {
            const offscreenX = $positionX < 0 ? -window.innerWidth : window.innerWidth * 2
            positionX.update(() => offscreenX)
        } else {
            positionX.update(() => 0)
        }
    }

    function handleOpacity(): void {
        if (toastElement) {
            const { left, right } = toastElement.getBoundingClientRect()
            const toastCenterX = (left + right) / 2
            const windowCenterX = window.innerWidth / 2
            const displacement = Math.abs(window.innerWidth - windowCenterX - toastCenterX)
            const opacityValue = 1.1 - displacement / windowCenterX
            toastElement.style.opacity = `${opacityValue}`
        }
    }

    function handleVelocity(event: CustomEvent): void {
        const displacement = Math.abs(event.detail.endX - event.detail.initX)
        const time = (event.detail.endTime - event.detail.initTime) / 1000
        const slideVelocity = Math.round(displacement / time) || 0
        isVelocityReached = slideVelocity > 600
    }
</script>

{#if $mobile}
    <toast-container class="flex flex-col relative z-60 mobile-container">
        <ul class="space-y-2">
            {#key toasts}
                {#each toasts as toast}
                    <li
                        use:slidable
                        on:slideMove={(event) => handleSlideMove(event, toast.id)}
                        on:slideEnd={handleSlideEnd}
                    >
                        <Toast {...toast} />
                    </li>
                {/each}
            {/key}
        </ul>
    </toast-container>
{:else}
    <toast-container class="flex flex-col relative z-60 desktop-container">
        <ul class="space-y-2">
            {#each toasts as toast}
                <li transition:fade={{ duration: 100 }}>
                    <Toast {...toast} />
                </li>
            {/each}
        </ul>
    </toast-container>
{/if}

<style type="text/scss">
    .mobile-container {
        z-index: 100;
        position: fixed;
        top: calc(env(safe-area-inset-top) + 20px);
        left: 20px;
        right: 20px;
    }

    .desktop-container {
        position: absolute;
        right: 20px;
        bottom: 20px;
        width: 400px;
    }
</style>
