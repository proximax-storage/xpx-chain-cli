import {AggregateCompleteView} from '../../../../../src/views/transactions/details/transaction-types'
import {unsignedAggregateComplete1} from '../../../../mocks/transactions/aggregateComplete.mock'
import {expect} from 'chai'

describe('AggregateCompleteView', () => {
 it('should return a view', () => {
  const view = AggregateCompleteView.get(unsignedAggregateComplete1)

  expect(view['title0']).deep.equal({
   content: 'Inner transaction 1 of 2 - Transfer',
   colSpan: 2,
   hAlign: 'center',
  })

  expect(view['[Inner tx. 1 of 2] Recipient']).equal('TALRJL-Z2FDOI-B7JCZJ-ANUJCM-GCJA6R-BRIYK4-NTDM')
  expect(view['[Inner tx. 1 of 2] Message']).equal('This is a mock message!')
  expect(view['[Inner tx. 1 of 2] Mosaic (1/1)']).equal('1 D525AD41D95FCF29')

  expect(view['title1']).deep.equal({
   content: 'Inner transaction 2 of 2 - Transfer',
   colSpan: 2,
   hAlign: 'center',
  })

  expect(view['[Inner tx. 2 of 2] Recipient']).equal('alice (9CF66FB0CFEED2E0)')
  expect(view['[Inner tx. 2 of 2] Message']).equal('This is a mock message!')
  expect(view['[Inner tx. 2 of 2] Mosaic (1/2)']).equal('1 D525AD41D95FCF29')
  expect(view['[Inner tx. 2 of 2] Mosaic (2/2)']).equal('1,234,567,890 prx.xpx (BFFB42A19116BDF6)')
 })
})
