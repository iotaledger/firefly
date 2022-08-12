import { sleep } from '@lib/utils'

export async function findShimmerRewards(): Promise<void> {
    try {
        await sleep(2000)
    } catch (err) {
        console.error(err)
    }
}
