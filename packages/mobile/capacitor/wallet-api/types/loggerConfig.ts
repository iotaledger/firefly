// Copyright 2021-2022 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0

/** Logger output configuration. */
export interface LoggerConfig {
    /** Name of an output file, or `stdout` for standard output.*/
    name?: string;
    /** Log level filter of an output.*/
    levelFilter?: 'off' | 'error' | 'warn' | 'info' | 'debug' | 'trace';
    /** Log target filters of an output.*/
    targetFilter?: string[];
    /** Log target exclusions of an output.*/
    targetExclusions?: string[];
    /** Color flag of an output.*/
    colorEnabled?: boolean;
}
