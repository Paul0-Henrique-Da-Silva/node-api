import { DbAddAccount } from "../src/data/usecases/add-account/db-add-account"
import { Encrypter } from "../src/data/protocols/encrypter"
import { resolve } from "path"

interface SubTypes {
    sut: DbAddAccount
    encrypterStub: Encrypter
}

const makeEncrypter = (): Encrypter => {
    class EncrypterStub implements Encrypter {
        async encrypt(value: string): Promise<string> {
            return new Promise(resolve => resolve('hashed_password'))
        }
    }
    return new EncrypterStub()
}

const makeSut = (): SubTypes => {
    const encrypterStub = makeEncrypter() // logica q vai criptar
    const sut = new DbAddAccount(encrypterStub) // passada no constructor 
    return { sut, encrypterStub }
}


describe('DbAddAccount Usecase', () => {
    test('A senha é cryptografada com a senha correta', async () => {
        const { sut, encrypterStub } = makeSut()

        const encryptSpy = jest.spyOn(encrypterStub, 'encrypt') // monitora 

        const accountData = { name: 'valid_name', email: 'valid_email', password: 'valid_password' }
        await sut.add(accountData) //null

        expect(encryptSpy)
        .toHaveBeenCalledWith('valid_password') // await this.encrypter.encrypt(account.password)
    })
    test('Retorne um erro se tiver alguma exceçâo', async () => {
        const { sut, encrypterStub } = makeSut()

        jest.spyOn(encrypterStub, 'encrypt')
        .mockResolvedValueOnce(new Promise((_resolve, reject) => reject(new Error())))

        const accountData = { name: 'valid_name', email: 'valid_email', password: 'valid_password' }
        const promise = sut.add(accountData) 

        await expect(promise).rejects.toThrow()
    })
})