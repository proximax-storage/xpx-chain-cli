import {CreateProfileOptions} from '../interfaces/create.profile.command'
import {Resolver} from './resolver'
import {BlockHttp} from 'tsjs-xpx-chain-sdk'
import {ExpectedError} from 'clime'

/**
 * Generation hash resolver
 */
export class GenerationHashResolver implements Resolver {

    /**
     * Resolves generationHash. If not provided by the user, this is asked to the node.
     * @param {CreateProfileOptions} options - Command options.
     * @returns {Promise<string>}
     */
    async resolve(options: CreateProfileOptions): Promise<string> {
        let generationHash = ''
        const blockHttp = new BlockHttp(options.url)
        try {
            generationHash = options.generationHash
                ? options.generationHash : (await blockHttp.getBlockByHeight(1).toPromise()).generationHash
        } catch (ignored) {
            throw new ExpectedError('Check if you can reach the ProximaX url provided: ' + options.url + '/block/1')
        }
        return generationHash
    }
}
