import { IClientOptions, CoinType, SecretManagerType, GenerateAddressOptions, Bip44 } from '@iota/sdk/out/types'

import { generateRandomId } from '@core/utils'

import { IProfileManager } from '../interfaces'
import { api } from '../api';
import { SecretManager } from '@iota/sdk';

// TODO: Rename this to something like WalletManager or whatever
class ProfileManager {
    storagePath: string;
    clientOptions?: IClientOptions;
    secretManager?: SecretManagerType;
    secretManagerBind?: SecretManager;
    bipPath: Bip44
    id: string

    constructor( storagePath: string,
        id: string,
        secretManager?: SecretManagerType,
        clientOptions?: IClientOptions,
        coinType?: CoinType,
        secretManagerBind?: SecretManager
){
            this.id = id;
            this.storagePath = storagePath;
            this.clientOptions = clientOptions;
            this.bipPath = {
                coinType: coinType
            }
            this.secretManager = secretManager;
            this.secretManagerBind = secretManagerBind;
        }

        async generateEd25519Address(
            accountIndex: number,
            options: GenerateAddressOptions,
            bech32Hrp: string
        ): Promise<string> {
            if(!this.secretManager){
                return undefined
            }
            // Ledger secret manager doesn't support this
            return (await this.secretManagerBind?.generateEd25519Addresses({
                accountIndex, options, bech32Hrp,
                range: {
                    start: 0,
                    end: 1,
                },
            }))[0]
        }

        async storeMnemonic(mnemonic: string): Promise<void> {
            return this.secretManagerBind?.storeMnemonic(mnemonic)
        }

        getSecretManagerOptions(){
            return {
                storagePath: this.storagePath,
                clientOptions: this.clientOptions,
                bipPath: this.bipPath,
                secretManager: this.secretManager
            }
        }
}

export async function initialiseProfileManager(
    id: string,
    storagePath: string,
    coinType: CoinType,
    clientOptions?: IClientOptions,
    secretManager?: SecretManagerType,
): Promise<IProfileManager> {

    const secretManagerBind = await api.createSecretManager(secretManager); 

    const profileManager = new ProfileManager( 
        storagePath,
        id,
        secretManager,
        clientOptions,
        coinType,
        secretManagerBind
   );

    return profileManager as unknown as IProfileManager;
}
