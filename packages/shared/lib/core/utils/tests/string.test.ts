import { isStringTrue, getByteLengthOfString, stripTrailingSlash, stripSpaces, truncateString } from '@core/utils'

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
        it('should truncate the string correclty if "start" and "end" are greater than 0', () => {
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
})
