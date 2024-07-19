import {
    isStringTrue,
    getByteLengthOfString,
    stripTrailingSlash,
    stripSpaces,
    truncateString,
    getInitials,
    getTrimmedLength,
    getNthOccurrenceIndex,
} from '@core/utils'

describe('File: string.ts', () => {
    describe('Function: isStringTrue', () => {
        it('should return true if string is "true"', () => {
            expect(isStringTrue('true')).toBeTruthy()
        })
        it('should return false if string is different to "true"', () => {
            expect(isStringTrue('truee')).toBeFalsy()
            expect(isStringTrue('false')).toBeFalsy()
            expect(isStringTrue('')).toBeFalsy()
        })
    })

    describe('Function: getByteLengthOfString', () => {
        it('should correctly calculate amount of bytes for different strings', () => {
            expect(getByteLengthOfString('Hello World')).toBe(11)
            expect(getByteLengthOfString('Hello World!')).toBe(12)
            expect(getByteLengthOfString('Hello Wörld!')).toBe(13)
            expect(getByteLengthOfString('Hello Wòrld!')).toBe(13)
        })
        it('should return 0 if string is empty', () => {
            expect(getByteLengthOfString('')).toBe(0)
        })
    })

    describe('Function: stripTrailingSlash', () => {
        it('should remove trailing slash if trailing slashes exist', () => {
            expect(stripTrailingSlash('test/')).toBe('test')
        })
        it('should remove multiple trailing slashes if trailing slashes exist', () => {
            expect(stripTrailingSlash('test//')).toBe('test')
        })
        it('should not remove slashes if they are at the beginning or at the end of the word', () => {
            expect(stripTrailingSlash('te/st//')).toBe('te/st')
            expect(stripTrailingSlash('/test//')).toBe('/test')
        })
        it('should do nothing if no trailing slashes exist', () => {
            expect(stripTrailingSlash('test')).toBe('test')
        })
    })

    describe('Function: stripSpaces', () => {
        it('should remove all spaces if spaces exist', () => {
            expect(stripSpaces(' te  st ')).toBe('test')
        })
        it('should do nothing if no spaces exist', () => {
            expect(stripSpaces('test')).toBe('test')
        })
    })

    describe('Function: truncateString', () => {
        it('should truncate the string correctly if "start" and "end" are greater than 0', () => {
            expect(truncateString('Lorem ipsum', 3, 3)).toBe('Lor...sum')
        })
        it('should show no letters at the end if "end" is 0', () => {
            expect(truncateString('Lorem ipsum', 0, 3)).toBe('...sum')
        })
        it('should show no letters at the start if "start" is 0', () => {
            expect(truncateString('Lorem ipsum', 3, 0)).toBe('Lor...')
        })
        it('should do nothing if start and end would exactly include the word', () => {
            expect(truncateString('Lorem ipsum', 4, 7)).toBe('Lorem ipsum')
        })
        it('should do nothing if start and end would exactly include the word', () => {
            expect(truncateString('Lorem ipsum', 4, 7)).toBe('Lorem ipsum')
        })
        it('should do nothing if start and end would be overlapping', () => {
            expect(truncateString('Lorem ipsum', 7, 7)).toBe('Lorem ipsum')
        })
        it('should do nothing if the added dots would make the resulting string longer', () => {
            expect(truncateString('Lorem ipsum', 4, 6)).toBe('Lorem ipsum')
        })
    })

    describe('getInitials', () => {
        test('should return initials without character limit', () => {
            const result = getInitials('John Doe', 0)
            expect(result).toBe('')
        })

        test('should return initials with character limit', () => {
            const result = getInitials('John Doe', 1)
            expect(result).toBe('J')
        })

        test('should return initials with emojis', () => {
            const result = getInitials('🌟 John 👨‍💻 Doe', 2)
            expect(result).toBe('🌟J')
        })

        test('should ignore extra spaces', () => {
            const result = getInitials('   John    Doe   ', 2)
            expect(result).toBe('JD')
        })

        test('should return empty string for empty name', () => {
            const result = getInitials('', 2)
            expect(result).toBe('')
        })

        test('should return empty string for undefined name', () => {
            const result = getInitials(undefined, 2)
            expect(result).toBe('')
        })

        test('should return empty string for name with only spaces', () => {
            const result = getInitials('      ', 2)
            expect(result).toBe('')
        })

        test('should return empty string with negative character limit', () => {
            const result = getInitials('John Doe', -1)
            expect(result).toBe('')
        })

        test('should return all initials if max char succeeds amount of words', () => {
            const result = getInitials('John Doe', 10)
            expect(result).toBe('JD')
        })
    })

    describe('getTrimmedLength', () => {
        test('should return length of trimmed string', () => {
            const result = getTrimmedLength('   John Doe   ')
            expect(result).toBe(8)
        })

        test('should return 0 for an empty string', () => {
            const result = getTrimmedLength('')
            expect(result).toBe(0)
        })

        test('should return 0 for undefined input', () => {
            const result = getTrimmedLength(undefined)
            expect(result).toBe(0)
        })

        test('should return length of trimmed string with emojis', () => {
            const result = getTrimmedLength('🌟 John 👨‍💻 Doe')
            expect(result).toBe(14)
        })

        test('should return length of trimmed string with multiple spaces', () => {
            const result = getTrimmedLength('  John  Doe  ')
            expect(result).toBe(9)
        })
    })

    describe('getNthOccurrenceIndex', () => {
        test('should return the index of the first occurrence', () => {
            const result = getNthOccurrenceIndex('Hello World', 'o', 1)
            expect(result).toBe(4)
        })

        test('should return the index of the second occurrence', () => {
            const result = getNthOccurrenceIndex('Hello World', 'o', 2)
            expect(result).toBe(7)
        })

        test('should return -1 when the occurrence is not found', () => {
            const result = getNthOccurrenceIndex('Hello World', 'x', 1)
            expect(result).toBe(-1)
        })

        test('should return 0 when the string and character are empty', () => {
            const result = getNthOccurrenceIndex('', '', 1)
            expect(result).toBe(0)
        })

        test('should return -1 when the occurrence is zero', () => {
            const result = getNthOccurrenceIndex('Hello World', 'o', 0)
            expect(result).toBe(-1)
        })

        test('should return -1 when the occurrence is negative', () => {
            const result = getNthOccurrenceIndex('Hello World', 'o', -1)
            expect(result).toBe(-1)
        })

        test('should return the index of the third occurrence in a long string', () => {
            const result = getNthOccurrenceIndex('Lorem ipsum dolor sit amet, consectetur adipiscing elit.', 'i', 3)
            expect(result).toBe(42)
        })

        test('should return the index of the first occurrence of an emoji', () => {
            const result = getNthOccurrenceIndex('Hello World 😃', '😃', 1)
            expect(result).toBe(12)
        })
    })
})
