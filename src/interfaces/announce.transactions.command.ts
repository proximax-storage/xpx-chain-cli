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
import {HttpErrorHandler} from '../services/httpErrorHandler.service'
import {ProfileCommand, ProfileOptions} from './profile.command'
import chalk from 'chalk'
import {option} from 'clime'
import {Address, Listener, SignedTransaction, Transaction, TransactionAnnounceResponse, TransactionHttp } from 'tsjs-xpx-chain-sdk'
import {merge} from 'rxjs'
import {filter, mergeMap, tap} from 'rxjs/operators'

/**
 * Base command class to announce transactions.
 */
export abstract class AnnounceTransactionsCommand extends ProfileCommand {

    protected constructor() {
        super()
    }

    /**
     * Announces a transaction.
     * @param {SignedTransaction} signedTransaction
     * @param {string} url - Node URL.
     */
    protected announceTransaction(signedTransaction: SignedTransaction, url: string) {
        this.spinner.start()
        const transactionHttp = new TransactionHttp(url)
        transactionHttp
            .announce(signedTransaction)
            .subscribe((ignored) => {
                this.spinner.stop(true)
                console.log(chalk.green('\nTransaction announced correctly.'))
            }, (err) => {
                this.spinner.stop(true)
                console.log(HttpErrorHandler.handleError(err))
            })
    }

    /**
     * Announces a transaction waiting for the response.
     * @param {SignedTransaction} signedTransaction
     * @param {Address} senderAddress - Address of the account sending the transaction.
     * @param {string} url - Node URL.
     */
    protected announceTransactionSync(signedTransaction: SignedTransaction, senderAddress: Address, url: string) {
        this.spinner.start()
        const transactionHttp = new TransactionHttp(url)
        const listener = new Listener(url)
        listener.open().then(() => {
            merge(
                transactionHttp.announce(signedTransaction),
                listener
                    .confirmed(senderAddress)
                    .pipe(
                        filter((transaction) => transaction.transactionInfo !== undefined
                            && transaction.transactionInfo.hash === signedTransaction.hash),
                    ),
                listener
                    .status(senderAddress)
                    .pipe(
                        filter((error) => error.hash === signedTransaction.hash),
                        tap((error) => {
                            throw new Error(error.status)
                        })))
                .subscribe((response) => {
                    if (response instanceof TransactionAnnounceResponse) {
                        this.spinner.stop(true)
                        console.log(chalk.green('\nTransaction announced.'))
                        this.spinner.start()
                    }
                    else if (response instanceof Transaction){
                        listener.close()
                        this.spinner.stop(true)
                        console.log(chalk.green('\nTransaction confirmed.'))
                    }
                }, (err) => {
                    listener.close()
                    this.spinner.stop(true)
                    console.log(HttpErrorHandler.handleError(err))
                })
        }, (err) => {
            listener.close()
            this.spinner.stop(true)
            console.log(chalk.red('Error'), err.message)
        })
    }

    /**
     * Announces a hash lock transaction. Once this is confirmed, announces an aggregate transaction.
     * @param {SignedTransaction} signedHashLockTransaction
     * @param {SignedTransaction} signedAggregateTransaction
     * @param {Address} senderAddress - Address of the account sending the transaction.
     * @param {string} url - Node URL.
     */
    protected announceAggregateTransaction(signedHashLockTransaction: SignedTransaction,
                                           signedAggregateTransaction: SignedTransaction,
                                           senderAddress: Address,
                                           url: string) {
        this.spinner.start()
        let confirmations = 0
        const transactionHttp = new TransactionHttp(url)
        const listener = new Listener(url)
        listener.open().then(() => {
            merge(
                transactionHttp.announce(signedHashLockTransaction),
                listener
                    .status(senderAddress)
                    .pipe(
                        filter((error) => error.hash === signedHashLockTransaction.hash),
                        tap((error) => {
                            throw new Error(error.status)
                        })),
                listener
                    .confirmed(senderAddress)
                    .pipe(
                        filter((transaction) => transaction.transactionInfo !== undefined
                            && transaction.transactionInfo.hash === signedHashLockTransaction.hash),
                        mergeMap((ignored) => transactionHttp.announceAggregateBonded(signedAggregateTransaction)),
                    ),
            )
                .subscribe((ignored) => {
                    confirmations = confirmations + 1
                    if (confirmations === 1) {
                        this.spinner.stop(true)
                        console.log(chalk.green('\n Hash lock transaction announced.'))
                        this.spinner.start()
                    } else if (confirmations === 2) {
                        listener.close()
                        this.spinner.stop(true)
                        console.log(chalk.green('\n Hash lock transaction confirmed.'))
                        console.log(chalk.green('\n Aggregate transaction announced.'))
                    }
                }, (err) => {
                    listener.close()
                    this.spinner.stop(true)
                    console.log(HttpErrorHandler.handleError(err))
                })
        }, (err) => {
            listener.close()
            this.spinner.stop(true)
            console.log(HttpErrorHandler.handleError(err))
        })
    }
}

/**
 * Announce transactions options
 */
export class AnnounceTransactionsOptions extends ProfileOptions {
    @option({
        flag: 'p',
        description: 'Profile password.',
    })
    password: string

    @option({
        flag: 'f',
        description: 'Maximum fee (absolute amount).',
    })
    maxFee: string

    @option({
        description: '(Optional) Wait until the server confirms or rejects the transaction.',
        toggle: true,
    })
    sync: any

    @option({
        description: '(Optional) Announce the transaction without double confirmation.',
        toggle: true,
    })
    announce: any

}

/**
 * Announce aggregate transactions options
 */
export class AnnounceAggregateTransactionsOptions extends AnnounceTransactionsOptions {

    @option({
        flag: 'F',
        description: 'Maximum fee (absolute amount) to announce the hash lock transaction.',
    })
    maxFeeHashLock: string

    @option({
        flag: 'D',
        description: 'Hash lock duration expressed in blocks.',
        default: '480',
    })
    duration: string

    @option({
        flag: 'L',
        description: 'Relative amount of network mosaic to lock.',
        default: '10',
    })
    amount: string
}
