/*
 *
 * Copyright 2018-present NEM
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
 *
 */

import {account1} from '../accounts.mock'
import {unsignedTransfer1, unsignedTransfer2} from '../transactions/transfer.mock'
import {AggregateTransaction, Deadline, NetworkType} from 'tsjs-xpx-chain-sdk'

export const unsignedAggregateComplete1 = AggregateTransaction.createComplete(
 Deadline.create(),
 [
  unsignedTransfer1.toAggregate(account1.publicAccount),
  unsignedTransfer2.toAggregate(account1.publicAccount),
 ],
 NetworkType.MIJIN_TEST,
 [],
)
