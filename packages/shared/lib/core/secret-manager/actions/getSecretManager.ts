import { SecretManager } from '@iota/sdk';
import { get } from 'svelte/store';
import { activeProfileSecretManager } from '../stores';

export function getSecretManager(): SecretManager {
    return get(activeProfileSecretManager) as SecretManager
}