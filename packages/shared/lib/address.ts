export const isValidAddressAndPrefix = (address: string, expectedAddressPrefix: string): boolean =>
    new RegExp(`^${expectedAddressPrefix}1[02-9ac-hj-np-z]{59}$`).test(address)
