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


import {
 AccountAddressRestrictionView,
 AccountLinkView,
 AccountMetadataView,
 AccountMosaicRestrictionView,
 AccountOperationRestrictionView,
 AddressAliasView,
 AggregateBondedView,
 AggregateCompleteView,
 LockFundsView,
 MosaicAliasView,
 MosaicDefinitionView,
 MosaicMetadataView,
 MosaicSupplyChangeView,
 MultisigAccountModificationView,
 NamespaceMetadataView,
 NamespaceRegistrationView,
 SecretLockView,
 SecretProofView,
 TransferView,
} from './transaction-types'
import {CellRecord} from './transaction.view'
import {Transaction, TransactionType} from 'tsjs-xpx-chain-sdk'

/**
 * @param  {Transaction} transaction
 * @returns {CellRecord}
 */
export const transactionDetailViewFactory = (tx: Transaction): CellRecord => {
  const formatters:[number, (tx: any) => CellRecord][] = [
    [TransactionType.TRANSFER, TransferView.get],
    [TransactionType.REGISTER_NAMESPACE, NamespaceRegistrationView.get],
    [TransactionType.ADDRESS_ALIAS, AddressAliasView.get],
    [TransactionType.MOSAIC_ALIAS, MosaicAliasView.get],
    [TransactionType.MOSAIC_DEFINITION, MosaicDefinitionView.get],
    [TransactionType.MOSAIC_SUPPLY_CHANGE, MosaicSupplyChangeView.get],
    [TransactionType.MODIFY_MULTISIG_ACCOUNT, MultisigAccountModificationView.get],
    [TransactionType.AGGREGATE_COMPLETE, AggregateCompleteView.get],
    [TransactionType.AGGREGATE_BONDED, AggregateBondedView.get],
    [TransactionType.LOCK, LockFundsView.get],
    [TransactionType.SECRET_LOCK, SecretLockView.get],
    [TransactionType.SECRET_PROOF, SecretProofView.get],
    [TransactionType.MODIFY_ACCOUNT_RESTRICTION_ADDRESS, AccountAddressRestrictionView.get],
    [TransactionType.MODIFY_ACCOUNT_RESTRICTION_MOSAIC, AccountMosaicRestrictionView.get],
    [TransactionType.MODIFY_ACCOUNT_RESTRICTION_OPERATION, AccountOperationRestrictionView.get],
    [TransactionType.LINK_ACCOUNT, AccountLinkView.get],
    [TransactionType.MODIFY_ACCOUNT_METADATA, AccountMetadataView.get],
    [TransactionType.MODIFY_MOSAIC_METADATA, MosaicMetadataView.get],
    [TransactionType.MODIFY_NAMESPACE_METADATA, NamespaceMetadataView.get],
   ];
  const formatter = formatters.find(formatter => formatter[0] === tx.type);
  if (formatter) {
      return formatter[1](tx);
  } else {
    throw new Error(`Transaction type not found: ${tx.type}`)
  }
}
