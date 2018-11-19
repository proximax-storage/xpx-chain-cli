/*
 *
 * Copyright 2018 NEM
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
import {
    AggregateTransaction,
    LockFundsTransaction,
    ModifyMultisigAccountTransaction,
    MosaicDefinitionTransaction,
    MosaicSupplyChangeTransaction,
    MosaicSupplyType,
    MultisigCosignatoryModificationType,
    NamespaceType,
    RegisterNamespaceTransaction,
    SecretLockTransaction,
    SecretProofTransaction,
    Transaction,
    TransferTransaction,
} from 'proximax-nem2-sdk';

export class TransactionService {

    constructor() {

    }

    public formatTransactionToFilter(transaction: Transaction): string {
        let transactionFormatted = '';
        if (transaction instanceof TransferTransaction) {
            transactionFormatted += 'TransferTransaction: Recipient:' + transaction.recipient.pretty();
            transactionFormatted += transaction.message.payload.length > 0 ? ' Message:\"' + transaction.message.payload + '\"' : '';
            if (transaction.mosaics.length > 0) {
                transactionFormatted += ' Mosaics: ';
                transaction.mosaics.map((mosaic) => {
                    transactionFormatted += mosaic.id.toHex() + ':' + mosaic.amount.compact() + ',';
                });
                transactionFormatted = transactionFormatted.substr(0, transactionFormatted.length - 1);
            }


        } else if (transaction instanceof RegisterNamespaceTransaction) {
            transactionFormatted += 'RegisterNamespaceTransaction: NamespaceName:' + transaction.namespaceName;

            if (transaction.namespaceType === NamespaceType.RootNamespace && transaction.duration !== undefined) {
                transactionFormatted += ' NamespaceType:RootNamespace Duration:' + transaction.duration.compact();
            } else if (transaction.parentId !== undefined) {
                transactionFormatted += ' NamespaceType:SubNamespace ParentId:' + transaction.parentId.toHex();
            }

        } else if (transaction instanceof MosaicDefinitionTransaction) {
            transactionFormatted += 'MosaicDefinitionTransaction: ' +
            'MosaicName:' + transaction.mosaicName +
            ' Duration:' + transaction.mosaicProperties.duration.compact() +
            ' Divisibility:' + transaction.mosaicProperties.divisibility +
            ' SupplyMutable:' + transaction.mosaicProperties.supplyMutable +
            ' Transferable:' + transaction.mosaicProperties.transferable +
            ' LevyMutable:' + transaction.mosaicProperties.levyMutable;

        } else if (transaction instanceof MosaicSupplyChangeTransaction) {
            transactionFormatted += 'MosaicSupplyChangeTransaction: ' +
            'MosaicId:' + transaction.mosaicId.toHex();
            transactionFormatted += ' Direction:' + (transaction.direction === MosaicSupplyType.Increase ?
                    'IncreaseSupply' : 'DecreaseSupply');
            transactionFormatted += ' Delta:' + transaction.delta.compact();

        } else if (transaction instanceof ModifyMultisigAccountTransaction) {
            transactionFormatted += 'ModifyMultisigAccountTransaction:' +
            ' MinApprovalDelta:' + transaction.minApprovalDelta +
            ' MinRemovalDelta:' + transaction.minRemovalDelta;

            transaction.modifications.map((modification) => {
                transactionFormatted += ' Type:' +
                    (modification.type === MultisigCosignatoryModificationType.Add ? 'Add' : 'Remove');
                transactionFormatted += ' CosignatoryPublicAccount:' + modification.cosignatoryPublicAccount.address.pretty();
            });

        } else if (transaction instanceof AggregateTransaction) {
            transactionFormatted += 'AggregateTransaction: ';

            if (transaction.cosignatures.length > 0) {
                transactionFormatted += 'Cosignatures:';
            }

            transaction.cosignatures.map((cosignature) => {
                transactionFormatted += ' Signer:' + cosignature.signer.address.pretty();
            });

            if (transaction.innerTransactions.length > 0) {
                transactionFormatted += ' InnerTransactions: [';
                transaction.innerTransactions.map((innerTransaction) => {
                    transactionFormatted += ' ' + this.formatTransactionToFilter(innerTransaction) + '';
                });
                transactionFormatted += ' ]';

            }
        } else if (transaction instanceof LockFundsTransaction) {
            transactionFormatted += 'LockFundsTransaction: ' +
                'Mosaic:' + transaction.mosaic.id.toHex() + ':' + transaction.mosaic.amount.compact() +
                ' Duration:' + transaction.duration.compact() +
                ' Hash:' + transaction.hash;
        } else if (transaction instanceof SecretLockTransaction) {
            transactionFormatted += 'SecretLockTransaction: ' +
                'Mosaic:' + transaction.mosaic.id.toHex() + ':' + transaction.mosaic.amount.compact() +
                ' Duration:' + transaction.duration.compact() +
                ' HashType:' + (transaction.hashType === 0 ? 'SHA3_512' : ' unknown') +
                ' Secret:' + transaction.secret +
                ' Recipient:' + transaction.recipient.pretty();

        } else if (transaction instanceof SecretProofTransaction) {
            transactionFormatted += 'SecretProofTransaction: ' +
                'HashType:' + (transaction.hashType === 0 ? 'SHA3_512' : ' unknown') +
                ' Secret:' + transaction.secret +
                ' Proof:' + transaction.proof;
        }

        transactionFormatted += (transaction.signer ? ' Signer:' + transaction.signer.address.pretty() : '') +
            ' Deadline:' + transaction.deadline.value.toLocalDate().toString() +
            (transaction.transactionInfo && transaction.transactionInfo.hash ? ' Hash:' + transaction.transactionInfo.hash : '');
        return transactionFormatted;
    }

}
