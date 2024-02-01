import { get } from 'svelte/store'
import BigInteger from 'big-integer'
import { SpecialStream } from '../classes'
import { ACCOUNTS_CONTRACT, WITHDRAW } from '../constants'
import { Blake2b } from '@iota/crypto.js'
import { api, profileManager } from '../../profile-manager'
import { activeProfile } from '../../profile'
import { DEFAULT_CHAIN_CONFIGURATIONS } from '../../network'
import { Converter } from '@iota/util.js'
import { Bip44 } from '@iota/sdk/out/types'
import { HexEncodedString } from '@iota/sdk'

export interface WithdrawRequest {
    request: HexEncodedString
    requestId: HexEncodedString
}

export async function getLayer2WithdrawRequest(
    allowance: number,
    nonce: string,
    bip44: Bip44,
    gasBudget: number = 100000
): Promise<WithdrawRequest> {
    const metadataStream = new SpecialStream()
    const defaultChainConfig = DEFAULT_CHAIN_CONFIGURATIONS[get(activeProfile)?.network?.id]
    metadataStream.writeUInt8('requestType', 1) // This request is of type OffLedger (1)

    /* Request Essence */
    const chainIdBytes = Converter.hexToBytes(api.bech32ToHex(defaultChainConfig?.aliasAddress ?? ''))
    metadataStream.writeBytes('chainId', chainIdBytes.length, chainIdBytes)

    metadataStream.writeUInt32('targetContract', ACCOUNTS_CONTRACT)
    metadataStream.writeUInt32('contractFunction', WITHDRAW)

    metadataStream.writeUInt64SpecialEncoding('numOfParams', BigInteger(0))
    metadataStream.writeUInt64SpecialEncoding('nonce', BigInteger(nonce))
    metadataStream.writeUInt64SpecialEncoding('gasBudget', BigInteger(gasBudget))

    const allowanceType = 0x80 // This sets the allowance. It only contains base tokens, which is indicated by the 0x80
    metadataStream.writeUInt8('allowanceType', allowanceType)
    metadataStream.writeUInt64SpecialEncoding('baseTokenAmount', BigInteger(allowance))

    // Signing
    const essenceBytes = Converter.bytesToHex(Blake2b.sum256(metadataStream.finalBytes(), undefined), true) // Hashes the buffer that has been constructed so far (It is called the Tx Essence)
    const secretManager = await api.getSecretManager(get(profileManager).id)
    const signed = await secretManager.signEd25519(essenceBytes, bip44) // Sign the essence with the secretManager and the Bip44 options set above.
    const publicKey = Converter.hexToBytes(signed.publicKey)
    const signature = Converter.hexToBytes(signed.signature)

    metadataStream.writeBytes('publicKey', publicKey.length, publicKey)

    metadataStream.writeUInt32SpecialEncoding('signatureLength', signature.length)
    metadataStream.writeBytes('signature', signature.length, signature)

    const request = '0x' + metadataStream.finalHex()

    // Construct request Id
    const hashRequest = Converter.bytesToHex(Blake2b.sum256(metadataStream.finalBytes(), undefined), true) // Hashes the buffer that has been constructed
    const requestId = hashRequest.concat('0000')

    return { request, requestId }
}
