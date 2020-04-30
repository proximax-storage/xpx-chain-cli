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
import {AnnounceTransactionsCommand, AnnounceTransactionsOptions} from '../../interfaces/announce.transactions.command'
import {ActionResolver} from '../../resolvers/action.resolver'
import {AddressAliasResolver} from '../../resolvers/address.resolver'
import {AnnounceResolver} from '../../resolvers/announce.resolver'
import {MaxFeeResolver} from '../../resolvers/maxFee.resolver'
import {RestrictionAccountAddressFlagsResolver} from '../../resolvers/restrictionAccount.resolver'
import {TransactionView} from '../../views/transactions/details/transaction.view'
import {ActionType} from '../../models/action.enum'
import {PasswordResolver} from '../../resolvers/password.resolver'
import {AccountRestrictionTransaction, Deadline, AccountRestrictionModification, add, Address, RestrictionModificationType} from 'tsjs-xpx-chain-sdk'
import {command, metadata, option} from 'clime'

export class CommandOptions extends AnnounceTransactionsOptions {
    @option({
        flag: 'f',
        description: 'Restriction flags.(' +
            'AllowOutgoingAddress, ' +
            'BlockOutgoingAddress, ' +
            'AllowIncomingAddress, ' +
            'BlockIncomingAddress)',
    })
    flags: string

    @option({
        flag: 'a',
        description: 'Modification action. (' +
            'Add, ' +
            'Remove).',
    })
    action: string

    @option({
        flag: 'v',
        description: 'Address or @alias to allow/block.',
    })
    recipientAddress: string
}

@command({
    description: 'Allow or block incoming and outgoing transactions for a given a set of addresses',
})
export default class extends AnnounceTransactionsCommand {
    constructor() {
        super()
    }

    @metadata
    async execute(options: CommandOptions) {
        const profile = this.getProfile(options)
        const password = await new PasswordResolver().resolve(options)
        const account = profile.decrypt(password)
        const action = await new ActionResolver().resolve(options)
        const flags = await new RestrictionAccountAddressFlagsResolver().resolve(options)
        const address = await new AddressAliasResolver()
        .resolve(options, undefined, 'Enter the recipient address (or @alias):', 'recipientAddress')
        const maxFee = await new MaxFeeResolver().resolve(options)

        const transaction = AccountRestrictionTransaction.createAddressRestrictionModificationTransaction(
            Deadline.create(),
            flags,
            [AccountRestrictionModification.createForAddress(
                action === ActionType.Add ? RestrictionModificationType.Add : RestrictionModificationType.Remove,
                address as Address)],
            profile.networkType,
            maxFee)
        const signedTransaction = account.sign(transaction, profile.networkGenerationHash)

        new TransactionView(transaction, signedTransaction).print()

        const shouldAnnounce = await new AnnounceResolver().resolve(options)
        if (shouldAnnounce && options.sync) {
            this.announceTransactionSync(signedTransaction, profile.address, profile.url)
        } else if (shouldAnnounce) {
            this.announceTransaction(signedTransaction, profile.url)
        }
    }

}
