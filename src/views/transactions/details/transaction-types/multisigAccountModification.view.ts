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
import {ModifyMultisigAccountTransaction, MultisigCosignatoryModificationType} from 'tsjs-xpx-chain-sdk'

export class MultisigAccountModificationView {
  /**
   * @static
   * @param {ModifyMultisigAccountTransaction} tx
   * @returns {CellRecord}
   */
  static get(tx: ModifyMultisigAccountTransaction): CellRecord {
    return new MultisigAccountModificationView(tx).render()
  }

  /**
   * Creates an instance of MultisigAccountModificationView.
   * @param {ModifyMultisigAccountTransaction} tx
   */
  private constructor(private readonly tx: ModifyMultisigAccountTransaction) {}

  /**
   * @private
   * @returns {CellRecord}
   */
  private render(): CellRecord {
    return {
      'Min approval delta': `${this.tx.minApprovalDelta}`,
      'Min removal delta': `${this.tx.minRemovalDelta}`,
      ...this.renderModifications(),
    }
  }

  /**
   * @private
   * @param {MultisigCosignatoryModificationType} type
   * @returns {CellRecord}
   */
  private renderModifications(): CellRecord {
    const modificationNumber = this.tx.modifications.length

    if (modificationNumber === 0) {return {} }

    const getKey = (index: number, type: MultisigCosignatoryModificationType) => `${type === MultisigCosignatoryModificationType.Add ? 'Public key addition' : 'Public key deletion'} (${index + 1} / ${modificationNumber})`

    return this.tx.modifications.reduce((mod, modification, index) => ({
      ...mod,
      [getKey(index, modification.type)]: modification.cosignatoryPublicAccount.address.pretty(),
    }), {})
  }
}
