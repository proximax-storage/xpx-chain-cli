import * as fs from 'fs'
import {ProfileCommand} from '../../src/interfaces/profile.command'
import {ProfileRepository} from '../../src/respositories/profile.repository'
import {NetworkType, Password, SimpleWallet} from 'tsjs-xpx-chain-sdk'
import {expect} from 'chai'

describe('Profile Command', () => {
    let repositoryFileUrl: string
    let command: ProfileCommand
    let wallet: SimpleWallet

    class StubCommand extends ProfileCommand {
        constructor() {
            super(repositoryFileUrl)
        }

        execute(...args: any[]) {
            throw new Error('Method not implemented.')
        }
    }

    const removeAccountsFile = () => {
        if (fs.existsSync(process.env.HOME || process.env.USERPROFILE + '/' + repositoryFileUrl)) {
            fs.unlinkSync(process.env.HOME || process.env.USERPROFILE + '/' + repositoryFileUrl)
        }
    }

    before(() => {
        removeAccountsFile()
        repositoryFileUrl = '.symbolrctest.json'
        wallet = SimpleWallet.create('test', new Password('12345678'), NetworkType.MIJIN_TEST)
        command = new StubCommand()
    })

    beforeEach(() => {
        removeAccountsFile()
    })

    after(() => {
        removeAccountsFile()
    })

    it('repository url should be overwritten', () => {
        expect(command['profileService']['profileRepository']['fileUrl']).to.equal(repositoryFileUrl)
    })

    it('should get a new profile', () => {
        new ProfileRepository(repositoryFileUrl).save(wallet, 'http://localhost:3000', '1')
        const options = {profile: wallet.name}
        const profile = command['getProfile'](options)
        expect(profile.name).to.equal(wallet.name)
    })

    it('should not get a profile that does not exist', () => {
        const options = {profile: 'random'}
        expect(() => command['getProfile'](options))
            .to.throws(Error)
    })

    it('should get a profile saved as default', () => {
        const profileRepository = new ProfileRepository(repositoryFileUrl)
        profileRepository.save(wallet, 'http://localhost:3000', '1')
        profileRepository.setDefault(wallet.name)
        const profile = command['getDefaultProfile']()
        expect(profile.name).to.be.equal(wallet.name)
    })

    it('should throw error if trying to retrieve a default profile that does not exist', () => {
        const profileRepository = new ProfileRepository(repositoryFileUrl)
        profileRepository.save(wallet, 'http://localhost:3000', '1')
        expect(() => command['getDefaultProfile']()).to.be.throws(Error)
    })

    it('should get all  saved profiles', () => {
        const profileRepository = new ProfileRepository(repositoryFileUrl)
        profileRepository.save(wallet, 'http://localhost:3000', '1')
        const profile = command['findAllProfiles']()[0]
        expect(profile.name).to.be.equal(wallet.name)
    })
})
