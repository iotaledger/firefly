import { english } from '../english'

export function generateRandomWord(excludedWords: string[]): string {
    let word: string

    do {
        const wordIndex = Math.floor(Math.random() * english.length)
        if (!excludedWords.includes(english[wordIndex])) {
            word = english[wordIndex]
        }
    } while (!word)

    return word
}
