import { DecayedMana } from '@iota/sdk/out/types'

export function getManaBalance(mana: DecayedMana): number {
    return Number(mana?.potential) + Number(mana?.stored)
}
