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
import {Profile} from '../models/profile.model'
import {ProfileRepository} from '../respositories/profile.repository'
import {ProfileService} from '../services/profile.service'
import {Command, ExpectedError, option, Options} from 'clime'
import {Spinner} from 'cli-spinner'

/**
 * Base command class to use the stored profile.
 */
export abstract class ProfileCommand extends Command {
    public spinner = new Spinner('processing.. %s')
    private readonly profileService: ProfileService

    /**
     * Constructor.
     */
    constructor(fileUrl?: string) {
        super()
        const profileRepository = new ProfileRepository(fileUrl || '.proximaxrc.json')
        this.profileService = new ProfileService(profileRepository)
        this.spinner.setSpinnerString('|/-\\')
    }

    /**
     * Gets profile by name.
     * @param {ProfileOptions} options - The  attribute "profile" should include the name.
     * @throws {ExpectedError}
     * @returns {Profile}
     */
    protected getProfile(options: ProfileOptions): Profile {
        try {
            if (options.profile) {
                return this.profileService.findProfileNamed(options.profile)
            }
            return this.profileService.getDefaultProfile()
        } catch (err) {
            throw new ExpectedError('Can\'t retrieve the current profile.' +
            'Use \'xpx-chain-cli profile list\' to check whether the profile exist, ' +
            'if not, use \'xpx-chain-cli profile create\' to create a new profile')
        }
    }

    /**
     * Gets default profile.
     * @throws {ExpectedError}
     * @returns {Profile}
     */
    protected getDefaultProfile(): Profile {
        try {
            return this.profileService.getDefaultProfile()
        } catch (err) {
            throw new ExpectedError('Can\'t retrieve the default profile.' +
                'Use \'xpx-chain-cli profile create\' to create a new default profile')
        }
    }

    /**
     * Gets all profiles.
     * @throws {ExpectedError}
     * @returns {Profile[]}
     */
    protected findAllProfiles(): Profile[] {
        try {
            return this.profileService.findAllProfiles()
        } catch (err) {
            throw new ExpectedError('Can\'t retrieve the profile list.')
        }
    }

}

/**
 * Profile options.
 */
export class ProfileOptions extends Options {
    @option({
        description: '(Optional) Select between your profiles, by providing a profile name.',
    })
    profile: string
}
