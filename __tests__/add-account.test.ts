import { DbAddAccount } from "../src/data/usecases/add-account/db-add-account"

describe('DbAddAccount Usecase', () => {
    test('A senha é cryptografada com a senha correta', async () => {
        class EncrypterStub {
            async encrypt(value: string): Promise<string> {
                return new Promise(resolve => resolve('hashed_password'))
            }
        }

        const encrypterStub = new EncrypterStub() // logica q vai criptar
        const sut = new DbAddAccount(encrypterStub) // passada no contructor 

        const encryptSpy = jest.spyOn(encrypterStub, 'encrypt') // monitora 

        const accountData = { name: 'valid_name', email: 'valid_email', password: 'valid_password' }
        await sut.add(accountData) //null

        expect(encryptSpy)
        .toHaveBeenCalledWith('valid_password') // await this.encrypter.encrypt(account.password)
    })
})