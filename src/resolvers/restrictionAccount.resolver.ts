import {OptionsChoiceResolver} from '../options-resolver'
import {AccountRestrictionFlagsValidator} from '../validators/restrictionType.validator'
import {Resolver} from './resolver'
import {RestrictionType} from 'tsjs-xpx-chain-sdk'
import {Options} from 'clime'

/**
 * Restriction account address flags resolver
 */
export class RestrictionAccountAddressFlagsResolver implements Resolver {

    /**
     * Resolves a restriction account address flag provided by the user.
     * @param {Options} options - Command options.
     * @param {string} altText - Alternative text.
     * @param {string} altKey - Alternative key.
     * @returns {Promise<number>}
     */
    async resolve(options: Options, altText?: string, altKey?: string): Promise<number> {
        const choices = [
            {title: 'AllowOutgoingAddress', value: RestrictionType.AllowAddress},
            {title: 'BlockIncomingAddress', value: RestrictionType.BlockAddress},
        ]
        const value = +(await OptionsChoiceResolver(options,
            altKey ? altKey : 'flags',
            altText ? altText : 'Select the restriction flags:',
            choices,
            'select',
            new AccountRestrictionFlagsValidator()
        ))
        return value
    }
}

/**
 * Restriction account mosaic flags resolver
 */
export class RestrictionAccountMosaicFlagsResolver implements Resolver {

    /**
     * Resolves a restriction account mosaic flag provided by the user.
     * @param {Options} options - Command options.
     * @param {string} altText - Alternative text.
     * @param {string} altKey - Alternative key.
     * @returns {Promise<number>}
     */
    async resolve(options: Options, altText?: string, altKey?: string): Promise<number> {
        const choices = [
            {title: 'AllowMosaic', value: RestrictionType.AllowMosaic},
            {title: 'BlockMosaic', value: RestrictionType.BlockMosaic},
        ]
        const value = +(await OptionsChoiceResolver(options,
            altKey ? altKey : 'flags',
            altText ? altText : 'Select the restriction flags:',
            choices,
            'select',
            new AccountRestrictionFlagsValidator()
        ))
        return value
    }
}

/**
 * Restriction account operation flags resolver
 */
export class RestrictionAccountOperationFlagsResolver implements Resolver {

    /**
     * Resolves a restriction account operation flag provided by the user.
     * @param {Options} options - Command options.
     * @param {string} altText - Alternative text.
     * @param {string} altKey - Alternative key.
     * @returns {Promise<number>}
     */
    async resolve(options: Options, altText?: string, altKey?: string): Promise<number> {
        const choices = [
            {title: 'AllowOutgoingTransactionType', value: RestrictionType.AllowTransaction},
            {title: 'BlockOutgoingTransactionType', value: RestrictionType.BlockTransaction},
        ]
        const value = +(await OptionsChoiceResolver(options,
            altKey ? altKey : 'flags',
            altText ? altText : 'Select the restriction flags:',
            choices,
            'select',
            new AccountRestrictionFlagsValidator()
        ))
        return value
    }
}
