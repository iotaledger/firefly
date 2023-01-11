// Copyright 2021 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0

import {
    sendMessageAsync,
    messageHandlerNew,
    listen as _listen,
    clearListeners as _clearListeners,
    destroy as _destroy,
} from './bindings';
import type {
    EventType,
    AccountManagerOptions,
    __Message__,
    __AccountMethod__,
    AccountId,
} from './types';

// The MessageHandler class interacts with messages with the rust bindings.
export async function MessageHandler(options?: AccountManagerOptions) {
    
    const messageOptions = {
            storagePath: options?.storagePath,
            clientOptions: options?.clientOptions,
            coinType: options?.coinType,
            secretManager: options?.secretManager
    };
    const { messageHandler } = await messageHandlerNew(messageOptions);
    // messageHandler = messageHandler.messageHandler;
    // console.error(messageHandler.messageHandler, 'received')
    
    async function sendMessage(message: __Message__): Promise<string> {
        return await sendMessageAsync(
            JSON.stringify(message),
            messageHandler,
        ).catch((error) => {
            try {
                error = JSON.parse(error).payload;
            } catch (e) {}
            return Promise.reject(error);
        });
    }

    async function callAccountMethod(
        accountIndex: AccountId,
        method: __AccountMethod__,
    ): Promise<string> {
        return sendMessage({
            cmd: 'callAccountMethod',
            payload: {
                accountId: accountIndex,
                method,
            },
        });
    }

    async function listen(
        eventTypes: EventType[],
        callback: (error: Error, result: string) => void,
    ): Promise<void> {
        await _listen({ eventTypes, messageHandler }, ({ error, result }) => {
            const Error = error ? {
                name: error.toString(), 
                message: error?.cause?.toString()
            } : undefined
            callback(
                Error,
                result
            )
        });
    }

    async function clearListeners(
        eventTypes: EventType[]
    ): Promise<void> {
        await _clearListeners({ eventTypes, messageHandler }, ({ error, result }) => {
            const Error = error ? {
                name: error.toString(), 
                message: error?.cause?.toString()
            } : undefined
            return Error || result
        });
    }

    function destroy(): void {
        _destroy({ messageHandler });
    }

    return {
        messageHandler,
        sendMessage,
        callAccountMethod,
        listen,
        clearListeners,
        destroy
    }
}
