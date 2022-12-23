import bcrypt from 'bcrypt'
import { BcryptAdapter } from '../src/infra/cryptography/bcrypt-adapter'

describe('Bcrypt Adapter', () => {
    test('Bcrypt seja chamado com os valores corretos',async () => {
        const salt = 12
        const sut = new BcryptAdapter(salt)
        const hashSpy = jest.spyOn(bcrypt, 'hash')
        await sut.encrypt('any_value')
        expect(hashSpy).toHaveBeenCalledWith('any_value', salt)
    })
})