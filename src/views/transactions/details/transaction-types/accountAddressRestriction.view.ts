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

import {CellRecord} from '../transaction.view'
import {AccountAddressRestrictionModificationTransaction, RestrictionType, Address, NamespaceId, AccountRestrictionModification, RestrictionModificationType} from 'tsjs-xpx-chain-sdk'

export class AccountAddressRestrictionView {
  /**
   * @static
   * @param {AccountAddressRestrictionModificationTransaction} tx
   * @returns {CellRecord}
   */
  static get(tx: AccountAddressRestrictionModificationTransaction): CellRecord {
    return new AccountAddressRestrictionView(tx).render()
  }

  /**
   * Creates an instance of AccountAddressRestrictionView.
   * @param {AccountAddressRestrictionModificationTransaction} tx
   */
  private constructor(private readonly tx: AccountAddressRestrictionModificationTransaction) {}

  /**
   * @private
   * @returns {CellRecord}
   */
  private render(): CellRecord {
    return {
      'Account restriction type': RestrictionType[this.tx.restrictionType],
      ...this.getRestrictions(),
    }
  }

  /**
   * @private
   * @returns {CellRecord}
   */
  private getRestrictions(): CellRecord {
    const numberOfModifications = this.tx.modifications.length;
    return {
      ...this.tx.modifications.reduce((mod, modification, index) => ({
        ...mod,
        ...this.renderRestriction(
          modification, index, numberOfModifications
        ),
      }), {})
    }
  }

  /**
   * @private
   * @param {AccountRestrictionModification<string>} modification
   * @param {number} index
   * @param {number} numberOfRestrictions
   * @returns {CellRecord}
   */
  private renderRestriction(
    modification: AccountRestrictionModification<string>,
    index: number,
    numberOfRestrictions: number,
  ): CellRecord {
    const key = `${modification.modificationType === RestrictionModificationType.Add ? "Addition" : "Deletion"} ${index + 1} of ${numberOfRestrictions}`
    const target = Address.createFromRawAddress(modification.value).pretty()
    return {[key]: target}
  }
}
