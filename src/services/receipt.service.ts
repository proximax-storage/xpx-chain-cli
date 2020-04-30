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
import chalk from 'chalk'
import {
    Address,
    ArtifactExpiryReceipt,
    BalanceChangeReceipt,
    BalanceTransferReceipt,
    InflationReceipt,
    ReceiptType,
    ResolutionEntry,
    ResolutionStatement,
    Statement,
    TransactionStatement,
    MosaicAlias,
} from 'tsjs-xpx-chain-sdk'

/**
 * Receipt service
 */
export class ReceiptService {

    /**
     * Constructor
     */
    constructor() {
    }

    /**
     * Formats transaction statements as a string.
     * @param {Statement} statement
     * @returns {string}
     */
    public formatTransactionStatements(statement: Statement): string {
        let txt = ''
        if (statement.transactionStatements.length > 0) {
            txt += chalk.green('transactionStatements:\t') + '\n'
            txt += '-'.repeat('transactionStatements:\t'.length) + '\n\n'
        }
        statement.transactionStatements.map((transaction: TransactionStatement, transactionIndex: number) => {
            txt += 'height:\t\t' + transaction.height + '\n'
            transaction.receipts.map((receipt: any, receiptIndex: number) => {
                txt += '<index: ' + transactionIndex + '-' + receiptIndex + '>\t'
                if (receipt instanceof BalanceTransferReceipt) {
                    txt += 'version:\t' + receipt.version + '\n'
                    txt += '\t\ttype:\t\t' + ReceiptType[receipt.type] + '\n'
                    txt += '\t\trecipientAddress:\t' +
                        (receipt.recipient instanceof Address ?
                            receipt.recipient.pretty() : receipt.recipient.toHex()) + '\n'
                    txt += '\t\tsenderPublickey:\t' + receipt.sender.publicKey + '\n'
                    txt += '\t\tmosaicId:\t' + receipt.mosaicId.toHex() + '\n'
                    txt += '\t\tamount:\t\t' + receipt.amount.toString() + '\n'
                } else if (receipt instanceof BalanceChangeReceipt) {
                    txt += 'version:\t' + receipt.version + '\n'
                    txt += '\t\ttype:\t\t' + ReceiptType[receipt.type] + '\n'
                    txt += '\t\ttargetPublicKey:\t' + receipt.account.publicKey + '\n'
                    txt += '\t\tmosaicId:\t' + receipt.mosaicId.toHex() + '\n'
                    txt += '\t\tamount:\t\t' + receipt.amount.toString() + '\n'
                } else if (receipt instanceof ArtifactExpiryReceipt) {
                    txt += 'version:\t' + receipt.version + '\n'
                    txt += '\t\ttype:\t\t' + ReceiptType[receipt.type] + '\n'
                    txt += '\t\tartifactId:\t' + receipt.artifactId.toHex() + '\n'
                } else if (receipt instanceof InflationReceipt) {
                    txt += 'version:\t' + receipt.version + '\n'
                    txt += '\t\ttype:\t\t' + ReceiptType[receipt.type] + '\n'
                    txt += '\t\tamount:\t\t' + receipt.amount.toString() + '\n'
                    txt += '\t\tmosaicId:\t' + receipt.mosaicId.toHex() + '\n'
                }
            })
        })
        return txt
    }

    /**
     * Formats address resolution statements as a string.
     * @param {Statement} statement
     * @returns {string}
     */
    public formatAddressResolutionStatements(statement: Statement): string {
        let txt = ''
        if (statement.addressResolutionStatements.length > 0) {
            txt += chalk.green('addressResolutionStatements:\t') + '\n'
            txt += '-'.repeat('addressResolutionStatements:\t'.length) + '\n\n'
        }
        statement.addressResolutionStatements.map((addressResolution: ResolutionStatement, addressResolutionIndex: number) => {
            txt += 'height:\t\t' + addressResolution.height + '\n'
            txt += 'unresolved:\t' + (addressResolution.unresolved instanceof Address ?
                addressResolution.unresolved.pretty() : addressResolution.unresolved.toHex()) + '\n\n'
            addressResolution.resolutionEntries.map((resolutionEntry: ResolutionEntry, resolutionEntryIndex: number) => {
                txt += '<index:' + addressResolutionIndex + '-' + resolutionEntryIndex + '>\t'
                txt += 'resolved:\t\t' + (resolutionEntry.resolved instanceof Address ?
                    resolutionEntry.resolved.pretty() : (resolutionEntry.resolved as MosaicAlias).toHex()) + '\n'
                txt += '\t\tprimaryId:\t\t' + resolutionEntry.source.primaryId + '\n'
                txt += '\t\tsecondaryId:\t\t' + resolutionEntry.source.secondaryId + '\n\n'
            })
        })
        return txt
    }

    /**
     * Formats mosaic resolution statements as a string.
     * @param {Statement} statement
     * @returns {string}
     */
    public formatMosaicResolutionStatements(statement: Statement): string {
        let txt = ''
        if (statement.mosaicResolutionStatements.length > 0) {
            txt += chalk.green('mosaicResolutionStatements:\t') + '\n'
            txt += '-'.repeat('mosaicResolutionStatements:\t'.length) + '\n\n'
        }
        statement.mosaicResolutionStatements.map((mosaicResolution: ResolutionStatement, mosaicResolutionIndex: number) => {
            txt += 'height:\t\t' + mosaicResolution.height + '\n'
            txt += 'unresolved:\t' + (mosaicResolution.unresolved instanceof Address ?
                mosaicResolution.unresolved.pretty() : mosaicResolution.unresolved.toHex()) + '\n\n'
            mosaicResolution.resolutionEntries.map((resolutionEntry: ResolutionEntry, resolutionEntryIndex: number) => {
                txt += '<index:' + mosaicResolutionIndex + '-' + resolutionEntryIndex + '>\t'
                txt += 'resolved:\t\t' + (resolutionEntry.resolved instanceof Address ?
                    resolutionEntry.resolved.pretty() : (resolutionEntry.resolved as MosaicAlias).toHex()) + '\n'
                txt += '\t\tprimaryId:\t\t' + resolutionEntry.source.primaryId + '\n'
                txt += '\t\tsecondaryId:\t\t' + resolutionEntry.source.secondaryId + '\n\n'
            })
        })
        return txt
    }
}
