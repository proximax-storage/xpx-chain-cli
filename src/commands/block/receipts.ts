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
import {ProfileCommand, ProfileOptions} from '../../interfaces/profile.command'
import {HeightResolver} from '../../resolvers/height.resolver'
import {ReceiptService} from '../../services/receipt.service'
import {HttpErrorHandler} from '../../services/httpErrorHandler.service'
import {BlockHttp} from 'tsjs-xpx-chain-sdk'
import {command, metadata, option} from 'clime'

export class CommandOptions extends ProfileOptions {
    @option({
        flag: 'h',
        description: 'Block height.',
    })
    height: string
}

@command({
    description: 'Get the receipts triggered for a given block height',
})
export default class extends ProfileCommand {
    private readonly receiptService: ReceiptService

    constructor() {
        super()
        this.receiptService = new ReceiptService()
    }

    @metadata
    async execute(options: CommandOptions) {
        const profile = this.getProfile(options)
        const height =  await new HeightResolver().resolve(options)

        this.spinner.start()
        const blockHttp = new BlockHttp(profile.url)
        blockHttp.getBlockReceipts(height.compact())
            .subscribe((statement: any) => {
                this.spinner.stop(true)
                let txt = ''
                txt += this.receiptService.formatTransactionStatements(statement)
                txt += this.receiptService.formatAddressResolutionStatements(statement)
                txt += this.receiptService.formatMosaicResolutionStatements(statement)
                if ('' === txt) {
                    txt = '[]'
                }
                console.log(txt)
            }, (err) => {
                this.spinner.stop(true)
                console.log(HttpErrorHandler.handleError(err))
            })
    }
}
