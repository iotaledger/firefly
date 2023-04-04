import { deletingNftId, resetNftDeleteQueue } from '../stores'

export function stopDeletingNftMediaFromQueue(): void {
    resetNftDeleteQueue()
    deletingNftId.set(undefined)
}
