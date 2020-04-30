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

import {NamespacesView} from '../../../namespaces.view'
import {CellRecord} from '../transaction.view'
import {ModifyMetadataTransaction, NamespaceId, MetadataModification, MetadataModificationType} from 'tsjs-xpx-chain-sdk'

export class NamespaceMetadataView {
  /**
   * @static
   * @param {ModifyMetadataTransaction} tx
   * @returns {CellRecord}
   */
  static get(tx: ModifyMetadataTransaction): CellRecord {
    return new NamespaceMetadataView(tx).render();
  }

  /**
   * Creates an instance of NamespaceMetadataView.
   * @param {ModifyMetadataTransaction} tx
   */
  private constructor(private readonly tx: ModifyMetadataTransaction) {}

  /**
   * @private
   * @returns {CellRecord}
   */
  private render(): CellRecord {
    return {
      'Namespace': NamespacesView.getNamespaceLabel(new NamespaceId(this.tx.metadataId)),
      ...this.getModifications(),
    }
  }

  /**
   * @private
   * @returns {CellRecord}
   */
  private getModifications(): CellRecord {
    const numberOfModifications = this.tx.modifications.length
    return {
      ...this.tx.modifications.reduce((mod, modification, index) => ({
        ...mod,
        ...this.renderModifications(
          modification, index, numberOfModifications
        ),
      }), {})
    }
  }

  /**
   * @private
   * @param {MetadataModification} modification
   * @param {number} index
   * @param {number} numberOfModifications
   * @returns {CellRecord}
   */
  private renderModifications(
    modification: MetadataModification,
    index: number,
    numberOfModifications: number,
  ): CellRecord {
    const key = `${modification.type === MetadataModificationType.ADD ? 'Addition' : 'Deletion'} ${index + 1} of ${numberOfModifications}`
    return {
      [key]: modification.key,
      'Value': modification.value
    }
  }
}
