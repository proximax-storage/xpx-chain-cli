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
import {AccountTransactionsCommand, AccountTransactionsOptions} from '../../interfaces/account.transactions.command'
import {TransactionView} from '../../views/transactions/details/transaction.view'
import {HttpErrorHandler} from '../../services/httpErrorHandler.service'
import {AccountHttp} from 'tsjs-xpx-chain-sdk'
import {command, metadata} from 'clime'
import { PublicKeyResolver } from '../../resolvers/publicKey.resolver'
import { NetworkResolver } from '../../resolvers/network.resolver'

@command({
    description: 'Fetch outgoing transactions from account',
})
export default class extends AccountTransactionsCommand {

    constructor() {
        super()
    }

    @metadata
    async execute(options: AccountTransactionsOptions) {
        const profile = this.getProfile(options)
        const networkType = await new NetworkResolver().resolve(options);
        const publicKey = await new PublicKeyResolver().resolve(options, networkType);

        this.spinner.start()
        const accountHttp = new AccountHttp(profile.url)
        accountHttp.outgoingTransactions(publicKey, options.getQueryParams())
            .subscribe((transactions) => {
                this.spinner.stop(true)
                transactions.forEach((transaction) => {
                    new TransactionView(transaction).print()
                })

                if (!transactions.length) {
                    console.log('There aren\'t outgoing transaction')
                }
            }, (err) => {
                this.spinner.stop(true)
                console.log(HttpErrorHandler.handleError(err))
            })
    }
}
