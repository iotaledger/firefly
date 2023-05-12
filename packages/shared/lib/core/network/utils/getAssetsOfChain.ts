import { Blake2b } from '@iota/crypto.js';
import { Converter } from '@iota/util.js';
import { get } from 'svelte/store';
import { ISC_SANDBOX_ABI } from '../abis/';
import { network } from '../stores';
import { Buffer } from 'buffer';

const ISC_CONTRACT_ADDRESS = '0x1074000000000000000000000000000000000000'
const HARDCODED_EVM_ADDRESS = 'PUT_YOUR_EVM_ADDRESS_HERE'
const NativeTokenIDLength = 38;

export async function getAssetsOfChain(): Promise<void> {
    const chains = get(network)?.getChains();
    const accountsCoreContract = hNameFromString('accounts');
    const getBalanceFunc = hNameFromString('balance');
    const agentID = evmAddressToAgentID(HARDCODED_EVM_ADDRESS);
    const parameters = getBalanceParameters(agentID);
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    chains?.forEach(async (chain) => {
        console.log('chain', chain)
        const provider = chain.getProvider();
        const contract = new provider.eth.Contract(ISC_SANDBOX_ABI, ISC_CONTRACT_ADDRESS);
        const nativeTokenResult = await contract.methods
            .callView(accountsCoreContract, getBalanceFunc, parameters)
            .call();
        const nativeTokens = [];

        console.log('nativeTokenResult', nativeTokenResult)

        for (const item of nativeTokenResult.items) {
            const id = item.key;
            const idBytes = Converter.hexToBytes(id);

            if (idBytes.length !== NativeTokenIDLength) {
                continue;
            }

            const nativeToken = {
                // TODO: BigInt is required for native tokens, but it causes problems with the range slider. This needs to be adressed before shipping.
                amount: BigInt(item.value),
                id: id,
                // metadata: await getNativeTokenMetaData(nodeClient, indexerClient, id),
            };

            nativeTokens.push(nativeToken);
        }
        console.log('nativeTokens', nativeTokens)
    })
}

function getBalanceParameters(agentID: Uint8Array) {
    return {
        items: [
            {
                key: Converter.utf8ToBytes('a'),
                value: agentID,
            },
        ],
    };
}

function evmAddressToAgentID(evmStoreAccount: string): Uint8Array {
    // This function constructs an AgentID that is required to be used with contracts
    // Wasp understands different AgentID types and each AgentID needs to provide a certain ID that describes it's address type.
    // In the case of EVM addresses it's ID 3.
    const agentIDKindEthereumAddress = 3;

    // Note: we need the evmStoreAccount to be in lower case, 
    // otherwise fetching balances using the iscmagic contract will fail,
    // because evm addresses are case-insensitive but hexToBytes is not.
    const receiverAddrBinary = Converter.hexToBytes(evmStoreAccount?.toLowerCase());
    const addressBytes = new Uint8Array([
        agentIDKindEthereumAddress,
        ...receiverAddrBinary,
    ]);

    return addressBytes;
}

function hNameFromString(name): number {
    const ScHNameLength = 4;
    const stringBytes = Converter.utf8ToBytes(name);
    const hash = Blake2b.sum256(stringBytes);

    for (let i = 0; i < hash.length; i += ScHNameLength) {
        const slice = hash.slice(i, i + ScHNameLength);
        const cursor = new SimpleBufferCursor(Buffer.from(slice));

        return cursor.readUInt32LE();
    }

    return 0;
}

class SimpleBufferCursor {
    private _buffer: Buffer;
    private _traverse: number;

    get buffer(): Buffer {
        return this._buffer;
    }

    constructor(buffer: Buffer = Buffer.alloc(0)) {
        this._buffer = buffer;
        this._traverse = 0;
    }

    readIntBE(length: number): number {
        const value = this._buffer.readIntBE(this._traverse, length);
        this._traverse += length;

        return value;
    }

    readUInt32LE(): number {
        const value = this._buffer.readUInt32LE(this._traverse);
        this._traverse += 4;

        return value;
    }

    readUInt64LE(): bigint {
        const value = this._buffer.readBigUInt64LE(this._traverse);
        this._traverse += 8;

        return value;
    }

    readUInt16LE(): number {
        const value = this._buffer.readUInt16LE(this._traverse);
        this._traverse += 2;

        return value;
    }

    readBytes(length: number): Uint8Array {
        const subBuffer = this._buffer.subarray(
            this._traverse,
            this._traverse + length,
        );
        this._traverse += length;

        return subBuffer;
    }

    writeIntBE(value: number, length: number): void {
        const nBuffer = Buffer.alloc(length);
        nBuffer.writeIntBE(value, 0, length);

        this._buffer = Buffer.concat([this._buffer, nBuffer]);
    }

    writeInt8(value: number): void {
        const nBuffer = Buffer.alloc(1);
        nBuffer.writeInt8(value, 0);

        this._buffer = Buffer.concat([this._buffer, nBuffer]);
    }

    writeUInt8(value: number): void {
        const nBuffer = Buffer.alloc(1);
        nBuffer.writeUInt8(value, 0);

        this._buffer = Buffer.concat([this._buffer, nBuffer]);
    }

    writeUInt32LE(value: number): void {
        const nBuffer = Buffer.alloc(4);
        nBuffer.writeUInt32LE(value, 0);

        this._buffer = Buffer.concat([this._buffer, nBuffer]);
    }

    writeUInt64LE(value: bigint): void {
        const nBuffer = Buffer.alloc(8);
        nBuffer.writeBigUInt64LE(value, 0);

        this._buffer = Buffer.concat([this._buffer, nBuffer]);
    }

    writeUInt16LE(value: number): void {
        const nBuffer = Buffer.alloc(2);
        nBuffer.writeUInt16LE(value, 0);

        this._buffer = Buffer.concat([this._buffer, nBuffer]);
    }

    writeUint8Array(bytes: Uint8Array) {
        for (let i = 0; i < bytes.length; i++) {
            this.writeUInt8(bytes[i]);
        }
    }

    writeBytes(bytes: Buffer): void {
        this._buffer = Buffer.concat([this._buffer, bytes]);
    }
}
