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
export async function MessageHandler(options?: AccountManagerOptions): Promise<{
    messageHandler: number;
    sendMessage: (message: __Message__) => Promise<string>;
    callAccountMethod: (
        accountIndex: AccountId,
        method: __AccountMethod__
    ) => Promise<string>;
    listen: (
        eventTypes: EventType[],
        callback: (error: Error, result: string) => void
    ) => Promise<void>;
    clearListeners: (eventTypes: EventType[]) => Promise<void>;
    destroy: () => void;
}> {

    const messageOptions = {
            storagePath: options?.storagePath,
            clientOptions: options?.clientOptions,
            coinType: options?.coinType,
            secretManager: options?.secretManager
    };
    const { messageHandler } = await messageHandlerNew(messageOptions);

    async function sendMessage(message: __Message__): Promise<string> {
        return sendMessageAsync(
            JSON.stringify(message),
            messageHandler,
        ).catch((error) => {
            try {
                error = JSON.parse(error).payload;
            // eslint-disable-next-line no-empty
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
        const callbackId = await _listen(
            {
                eventTypes,
                messageHandler
            },
            ({ error, result }) => {
                if (error) console.error('CALLBACK error!', error)
                if (result) console.error('CALLBACK result!', result)
                callback(
                    {
                        name: 'listen error',
                        message: error?.toString()
                    },
                    result
                )
        });
        console.error({callbackId})
        // callback(null, result)
    }

    async function clearListeners(
        eventTypes: EventType[]
    ): Promise<void> {
        const callbackId = await _clearListeners(
            {
                eventTypes,
                messageHandler
            },
            ({ error, result }) => {
                if (error) console.error('CALLBACK error!', error)
                if (result) console.error('CALLBACK result!', result)
                // callback(
                //     {
                //         name: 'listen error',
                //         message: error?.cause?.toString()
                //     },
                //     // null,
                //     result
                // )
        });
        console.error({callbackId})
        // callback(null, result)
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
