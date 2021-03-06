/**
 * Copyright 2019 Dragonchain, Inc. or its affiliates. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { DragonchainClient } from './services/dragonchain-client/DragonchainClient'

/**
 * @hidden
 */
// tslint:disable-next-line:no-empty
const nullLog = (msg: any) => {}
/**
 * @hidden
 */
let logger: any // singleton logger

// default logger will do nothing
const setLogger = (newLogger: any = { log: nullLog, info: nullLog, warn: nullLog, error: nullLog, debug: nullLog }) => {
  logger = newLogger
}

setLogger() // actually initialize the singleton on initial import

export { DragonchainClient, setLogger, logger }
