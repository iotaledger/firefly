import { registerPlugin } from '@capacitor/core';

import type { WalletPlugin } from './definitions';

const Wallet = registerPlugin<WalletPlugin>('Wallet');

export * from './definitions';
export { Wallet };
