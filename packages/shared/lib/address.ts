export const isValidAddressAndPrefix = (address: string, expectedAddressPrefix: string): boolean =>
    new RegExp(`^${expectedAddressPrefix}1[02-9ac-hj-np-z]{59}$`).test(address)

export const isValidEVMAddress = (address: string): boolean => new RegExp('0x[a-fA-F0-9]{40}$').test(address)
