import { isValidEVMAddress } from '../address'

describe('File: address.ts', () => {
    describe('Function: isValidEVMAddress', () => {
        it('Valid EVM Address', () => {
            const address = '0xF65e3cCbe04D4784EDa9CC4a33F84A6162aC9EB6'
            expect(isValidEVMAddress(address)).toEqual(true)
        })

        it('Invalid EVM Address (1 character too few)', () => {
            const address = '0xF65e3cCbe04D4784EDa9CC4a33F84A6162aC9EB'
            expect(isValidEVMAddress(address)).toEqual(false)
        })

        it('Invalid EVM Address (1 character too much)', () => {
            const address = '0xF65e3cCbe04D4784EDa9CC4a33F84A6162aC9EB62'
            expect(isValidEVMAddress(address)).toEqual(false)
        })

        it('Invalid EVM Address (iota address)', () => {
            const address = 'atoi1qz0mvjzjfwt5wcy8j8daw6avh67z77kquwkwzr5fvuu6pfzpjqgz7cptqex'
            expect(isValidEVMAddress(address)).toEqual(false)
        })
    })
})
