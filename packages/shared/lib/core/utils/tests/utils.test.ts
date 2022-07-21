import '@mocks/i18n'

import { migrateObjects, range, validateBech32Address } from '@lib/utils'

type Simple = {
    prop1?: string
    prop2?: string
    flag1?: boolean
    flag2?: boolean
}

type Data =
    | {
          path: string
          simple1?: Simple
          simple2?: Simple
      }
    | Simple[]

type Complex = {
    id: string
    data?: Data
}

describe('File: utils.ts', () => {
    describe('Function: migrateObjects', () => {
        it('should NOT migrate objects with similar props', () => {
            const o1: Simple = {
                prop1: 'First prop',
                flag1: true,
            }
            const o2: Simple = {
                prop1: 'Another first prop',
                flag1: false,
            }

            expect(migrateObjects(o1, o2)).toEqual(o1)
        })

        it('should NOT migrate objects with the same props', () => {
            const o1: Complex = {
                id: 'Object 01',
                data: {
                    path: 'path/to/all-of-the/data',
                    simple1: { flag1: true },
                    simple2: { prop2: 'PROP', flag2: false },
                },
            }
            const o2: Complex = {
                id: 'Object 02',
                data: {
                    path: 'path/to/all/of/the/data',
                    simple1: { flag1: false },
                    simple2: { prop2: 'PROPPP', flag2: true },
                },
            }
            expect(migrateObjects(o1, o2)).toEqual(o1)
        })

        it('should migrate objects with entirely different props', () => {
            const o1: Simple = {
                prop1: 'First prop',
                flag1: true,
            }
            const o2: Simple = {
                prop2: 'Second prop',
                flag2: false,
            }

            expect(migrateObjects(o1, o2)).toEqual(o2)
        })

        it('should migrate objects with somewhat different props', () => {
            const o1: Simple = {
                prop1: 'First prop',
                flag1: true,
            }
            const o2: Simple = {
                prop1: 'Another first prop',
                flag1: false,
                flag2: true,
            }

            expect(migrateObjects(o1, o2)).toEqual(<Simple>{
                prop1: 'First prop',
                flag1: true,
                flag2: true,
            })
        })

        it('may or may NOT migrate complex objects with similar props', () => {
            const o1: Complex = {
                id: 'Object 01',
                data: {
                    path: 'path/to/data',
                },
            }
            const o2: Complex = {
                id: 'Object 02',
                data: {
                    path: 'path/to/other/data',
                    simple1: { prop1: 'PROP', flag2: false },
                },
            }
            const o3: Complex = {
                id: 'Object 03',
                data: {
                    path: 'path/to/even-more/data',
                    simple1: { prop1: 'PROP', flag2: true },
                },
            }
            const o4: Complex = {
                id: 'Object 04',
                data: {
                    path: 'path/to/all-of-the/data',
                    simple1: { flag1: true },
                    simple2: { prop2: 'PROP', flag2: false },
                },
            }
            const o5: Complex = {
                id: 'Object 05',
                data: [
                    {
                        prop1: 'PROP',
                        flag2: true,
                    },
                    {
                        prop2: 'PROP',
                        flag1: true,
                    },
                ],
            }

            expect(migrateObjects(o1, o2)).toEqual(<Complex>{
                id: 'Object 01',
                data: {
                    path: 'path/to/data',
                    simple1: { prop1: 'PROP', flag2: false },
                },
            })
            expect(migrateObjects(o2, o3)).toEqual(o2)
            expect(migrateObjects(o3, o4)).toEqual(<Complex>{
                id: 'Object 03',
                data: {
                    path: 'path/to/even-more/data',
                    simple1: { flag1: true },
                    simple2: { prop2: 'PROP', flag2: false },
                },
            })
            expect(migrateObjects(o4, o5)).toEqual(<Complex>{
                id: 'Object 04',
                data: o5.data,
            })
        })
    })

    describe('Function: range', () => {
        it('should create ranges from valid arguments', () => {
            expect(range(0)).toEqual([])
            expect(range(1)).toEqual([0])
            expect(range(1, 1)).toEqual([1])
            expect(range(10, 10)).toEqual([10, 11, 12, 13, 14, 15, 16, 17, 18, 19])
            expect(range(10, -10)).toEqual([-10, -9, -8, -7, -6, -5, -4, -3, -2, -1])
        })
        it('should create empty ranges from invalid arguments', () => {
            // @ts-ignore
            expect(range(2, 'string')).toEqual([0, 1])
            expect(range(undefined)).toEqual([])
            expect(range(undefined, undefined)).toEqual([])
            expect(range(1, null)).toEqual([0])
            expect(range(-1)).toEqual([])
            expect(range(-1, 1)).toEqual([])
            expect(range(undefined, 1)).toEqual([])
        })
    })

    describe('Function: validateBech32Address', () => {
        it('should return error string if address is empty', () => {
            expect(
                validateBech32Address('atoi', 'iota1qqf446qvry56672nefltyac6xw54k5eww43hr9lpdv03x9403uaewd807lx')
            ).toEqual('Addresses start with the prefix atoi.')
        })
        it('should return error string if address is in wrong format', () => {
            expect(
                validateBech32Address('iota', 'iota2qqf446qvry56672nefltyac6xw54k5eww43hr9lpdv03x9403uaewd807lx')
            ).toEqual('The address is not correctly formatted.')
        })
        it('should return error string if address cannot be decoded', () => {
            expect(
                validateBech32Address('iota', 'iota1qqf446qvry56772nefltyac6xw54k5eww43hr9lpdv03x9403uaewd807lx')
            ).toEqual('The address is not valid.')
        })
        it('should return undefined if address is valid', () => {
            expect(
                validateBech32Address('iota', 'iota1qqf446qvry56672nefltyac6xw54k5eww43hr9lpdv03x9403uaewd807lx')
            ).toEqual(undefined)
        })
    })
})
