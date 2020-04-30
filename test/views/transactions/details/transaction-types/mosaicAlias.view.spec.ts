import {MosaicAliasView} from '../../../../../src/views/transactions/details/transaction-types'
import {mosaicId1} from '../../../../mocks/mosaics.mock'
import {unsignedMosaicAlias1} from '../../../../mocks/transactions/mosaicAlias.mock'
import {AliasAction} from 'tsjs-xpx-chain-sdk'
import {expect} from 'chai'

describe('MosaicAliasView', () => {
 it('should return a view', () => {
  const view = MosaicAliasView.get(unsignedMosaicAlias1)
  expect(view['Alias action']).equal(AliasAction[AliasAction.Link])
  expect(view['Mosaic Id']).equal(mosaicId1.toHex())
  expect(view['Namespace Id']).equal('prx.xpx (BFFB42A19116BDF6)')
 })
})
