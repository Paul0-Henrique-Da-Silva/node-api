import { DbAddAccount } from "../src/data/usecases/add-account/db-add-account"
import { Encrypter } from "../src/data/protocols/encrypter"
import { AddAccountModel } from "../src/domain/usercases/add-account"
import { AccountModel } from "../src/domain/models/account"
import { AddAcccountRepository } from "../src/data/protocols/add-acccount-repository"

const makeEncrypter = (): Encrypter => {
    class EncrypterStub implements Encrypter {
        async encrypt(value: string): Promise<string> {
            return new Promise(resolve => resolve('hashed_password'))
        }
    }
    return new EncrypterStub()
}

const makeAddAcccountRepository = (): AddAcccountRepository => {
    class AddAcccountRepositoryStub implements AddAcccountRepository {
        async add(accountData: AddAccountModel): Promise<AccountModel> {
            const fakeAccount = {
                id: 'valid_id', name: 'valid_name', email: 'valid_email', password: 'hashed_password'
            }
            return new Promise(resolve => resolve(fakeAccount))
        }
    }
    return new AddAcccountRepositoryStub()
}

interface SubTypes {
    sut: DbAddAccount
    encrypterStub: Encrypter
    addAcccountRepositoryStub: AddAcccountRepository
    
}

const makeSut = (): SubTypes => {
    const addAcccountRepositoryStub = makeAddAcccountRepository()
    const encrypterStub = makeEncrypter() // logica q vai criptar
    const sut = new DbAddAccount(encrypterStub, addAcccountRepositoryStub) // passada no constructor 
    return { sut, encrypterStub, addAcccountRepositoryStub }
}


describe('DbAddAccount Usecase', () => {
    test('A senha é cryptografada com a senha correta', async () => {
        const { sut, encrypterStub } = makeSut()
        const encryptSpy = jest.spyOn(encrypterStub, 'encrypt') // monitora o metodo
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

    test('AddAcccountRepository com calores corretos', async () => {
        const { sut, addAcccountRepositoryStub } = makeSut()
        const addSpy = jest.spyOn(addAcccountRepositoryStub, 'add' )
        const accountData = { name: 'valid_name', email: 'valid_email', password: 'hashed_password' }
        await sut.add(accountData) 

        expect(addSpy)
            .toHaveBeenCalledWith( 
                { name: 'valid_name', email: 'valid_email', password: 'hashed_password'
             }) 
    })

    test('Retorne um erro se tiver alguma exceçâo em addAcccountRepositoryStub', async () => {
        const { sut, addAcccountRepositoryStub } = makeSut()

        jest.spyOn(addAcccountRepositoryStub, 'add')
            .mockResolvedValueOnce(new Promise((_resolve, reject) => reject(new Error())))

        const accountData = { name: 'valid_name', email: 'valid_email', password: 'valid_password' }
        const promise = sut.add(accountData)

        await expect(promise).rejects.toThrow()
    })

    test('retorne um conta com valores corretos', async () => {
        const { sut } = makeSut()
        const accountData = { name: 'valid_name', email: 'valid_email', password: 'valid_password' }
        const account = await sut.add(accountData) 

        expect(account)
            .toEqual( 
                { id: 'valid_id', name: 'valid_name', email: 'valid_email', password: 'hashed_password'
             }) 
    })
})