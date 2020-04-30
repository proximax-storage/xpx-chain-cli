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
import {AddressResolver} from '../../resolvers/address.resolver'
import {HttpErrorHandler} from '../../services/httpErrorHandler.service'
import chalk from 'chalk'
import * as Table from 'cli-table3'
import {HorizontalTable} from 'cli-table3'
import {command, metadata, option} from 'clime'
import {MetadataHttp, Field} from 'tsjs-xpx-chain-sdk'

export class CommandOptions extends ProfileOptions {
    @option({
        flag: 'a',
        description: 'Account address.',
    })
    address: string
}

export class MetadataEntryTable {
    private readonly table: HorizontalTable

    constructor(public readonly entry: Field) {
        this.table = new Table({
            style: {head: ['cyan']},
            head: ['Type', 'Value'],
        }) as HorizontalTable

        this.table.push(
            ['Key', entry.key],
            ['Value', entry.value],
        )
    }

    toString(): string {
        let text = ''
        text += this.table.toString()
        return text
    }
}

@command({
    description: 'Fetch metadata entries from an account',
})
export default class extends ProfileCommand {

    constructor() {
        super()
    }

    @metadata
    async execute(options: CommandOptions) {
        const profile = this.getProfile(options)
        const address = await new AddressResolver().resolve(options, profile)

        this.spinner.start()
        const metadataHttp = new MetadataHttp(profile.url)
        metadataHttp.getAccountMetadata(address.plain())
            .subscribe((metadataEntries) => {
                this.spinner.stop(true)
                if (metadataEntries.fields.length > 0) {
                    metadataEntries.fields
                        .map((entry: Field) => {
                            console.log(new MetadataEntryTable(entry).toString())
                        })
                } else {
                    console.log('\n The address does not have metadata entries assigned.')
                }
            }, (err) => {
                this.spinner.stop(true)
                console.log(HttpErrorHandler.handleError(err))
            })
    }
}
