import {AddressAliasView} from '../../../../../src/views/transactions/details/transaction-types'
import {account1} from '../../../../mocks/accounts.mock'
import {unsignedAddressAlias1} from '../../../../mocks/transactions/addressAlias.mock'
import {AliasAction} from 'tsjs-xpx-chain-sdk'
import {expect} from 'chai'

describe('AddressAliasView', () => {
 it('should return a view', () => {
  const view = AddressAliasView.get(unsignedAddressAlias1)
  expect(view['action']).equal(AliasAction[unsignedAddressAlias1.aliasAction])
  expect(view['address']).equal(account1.address.pretty())
  expect(view['namespace']).equal('prx.xpx (BFFB42A19116BDF6)')
 })
})
