import { AddAccount, AddAccountModel } from '../../../domain/usercases/add-account'
import { AccountModel } from '../../../domain/models/account'
import { Encrypter } from '../../protocols/encrypter'
import { AddAcccountRepository } from '../../protocols/add-acccount-repository'

export class DbAddAccount implements AddAccount {
    private readonly _encrypter: Encrypter
    private readonly _addAcccountRepository: AddAcccountRepository

    constructor(encrypter: Encrypter, addAcccountRepository: AddAcccountRepository) {
        this._encrypter = encrypter
        this._addAcccountRepository = addAcccountRepository
    }

    async add(accountData: AddAccountModel): Promise<AccountModel> {
        const hashedPassword = await this._encrypter.encrypt(accountData.password)
        const account = await this._addAcccountRepository.add(Object.assign({}, accountData, { password: hashedPassword }))
        return account
    }

}
