import { AccountColors } from '../enums'

export function getRandomAccountColor(): string {
    const colors = Object.values(AccountColors).filter((_, i) => !(i % 2))
    return colors[Math.floor(Math.random() * colors.length)].toString()
}
