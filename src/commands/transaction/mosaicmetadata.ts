import {AnnounceAggregateTransactionsOptions, AnnounceTransactionsCommand} from '../../interfaces/announce.transactions.command'
import {AnnounceResolver} from '../../resolvers/announce.resolver'
import {KeyResolver} from '../../resolvers/key.resolver'
import {MaxFeeResolver} from '../../resolvers/maxFee.resolver'
import {MosaicIdResolver} from '../../resolvers/mosaic.resolver'
import {PublicKeyResolver} from '../../resolvers/publicKey.resolver'
import {StringResolver} from '../../resolvers/string.resolver'
import {TransactionView} from '../../views/transactions/details/transaction.view'
import {PasswordResolver} from '../../resolvers/password.resolver'
import {
    AggregateTransaction,
    Deadline,
    HashLockTransaction,
    MetadataHttp,
    UInt64,
    ModifyMetadataTransaction,
    MetadataModification,
    MetadataModificationType,
    NetworkCurrencyMosaic,
} from 'tsjs-xpx-chain-sdk'
import {command, metadata, option} from 'clime'

export class CommandOptions extends AnnounceAggregateTransactionsOptions {
    @option({
        flag: 'm',
        description: 'Mosaic id be assigned metadata in hexadecimal format.',
    })
    mosaicId: string

    @option({
        flag: 't',
        description: 'Mosaic id owner account public key.',
    })
    targetPublicKey: string

    @option({
        flag: 'k',
        description: 'Metadata key (UInt64) in hexadecimal format.',
    })
    key: string

    @option({
        flag: 'v',
        description: 'Value of metadata key.',
    })
    value: string
}

@command({
    description: 'Add custom data to a mosaic (requires internet)',
})
export default class extends AnnounceTransactionsCommand {
    constructor() {
        super()
    }

    @metadata
    async execute(options: CommandOptions) {
        const profile = this.getProfile(options)
        const password = await new PasswordResolver().resolve(options)
        const account = profile.decrypt(password)
        const mosaic = await new MosaicIdResolver().resolve(options)
        const targetAccount = await new PublicKeyResolver()
            .resolve(options, profile.networkType,
                'Enter the mosaic owner account public key:', 'targetPublicKey')
        const key = await new KeyResolver().resolve(options)
        const value = await new StringResolver().resolve(options)
        const maxFee = await new MaxFeeResolver().resolve(options)

        const metadataTransaction = ModifyMetadataTransaction.createWithMosaicId(
            account.address.networkType,
            Deadline.create(),
            mosaic,
            [
                new MetadataModification(MetadataModificationType.ADD, key, value)
            ],
            maxFee,
        )

        const isAggregateComplete = (targetAccount.publicKey === account.publicKey)
        if  (isAggregateComplete) {
            const aggregateTransaction = AggregateTransaction.createComplete(
                Deadline.create(),
                [metadataTransaction.toAggregate(account.publicAccount)],
                account.address.networkType,
                [],
                maxFee,
            )
            const signedTransaction = account.sign(aggregateTransaction, profile.networkGenerationHash)

            new TransactionView(aggregateTransaction, signedTransaction).print()

            const shouldAnnounce = await new AnnounceResolver().resolve(options)
            if (shouldAnnounce && options.sync) {
                this.announceTransactionSync(
                    signedTransaction,
                    account.address,
                    profile.url)
            } else if (shouldAnnounce) {
                this.announceTransaction(
                    signedTransaction,
                    profile.url)
            }
        } else {
            const aggregateTransaction = AggregateTransaction.createBonded(
                Deadline.create(),
                [metadataTransaction.toAggregate(account.publicAccount)],
                account.address.networkType,
                [],
                maxFee,
            )
            const signedTransaction = account.sign(aggregateTransaction, profile.networkGenerationHash)

            const maxFeeHashLock = await new MaxFeeResolver().resolve(options,
                'Enter the maximum fee to announce the hashlock transaction (absolute amount):', 'maxFeeHashLock')
            const hashLockTransaction = HashLockTransaction.create(
                Deadline.create(),
                NetworkCurrencyMosaic.createRelative(UInt64.fromNumericString(options.amount)),
                UInt64.fromNumericString(options.duration),
                signedTransaction,
                profile.networkType,
                maxFeeHashLock)
            const signedHashLockTransaction = account.sign(hashLockTransaction, profile.networkGenerationHash)

            new TransactionView(aggregateTransaction, signedTransaction).print()
            new TransactionView(hashLockTransaction, signedHashLockTransaction).print()

            const shouldAnnounce = await new AnnounceResolver().resolve(options)
            if (shouldAnnounce) {
                this.announceAggregateTransaction(
                    signedHashLockTransaction,
                    signedTransaction,
                    account.address,
                    profile.url)
            }
        }
    }
}
