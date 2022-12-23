import bcrypt from 'bcrypt'
import { BcryptAdapter } from '../src/infra/cryptography/bcrypt-adapter'

jest.mock('bcrypt', () => ({
    async hash (): Promise<string> {
        return new Promise(resolve => resolve('hash'))
    }
}))

describe('Bcrypt Adapter', () => {
    test('Bcrypt seja chamado com os valores corretos',async () => {
        const salt = 12
        const sut = new BcryptAdapter(salt)
        const hashSpy = jest.spyOn(bcrypt, 'hash')
        await sut.encrypt('any_value')
        expect(hashSpy).toHaveBeenCalledWith('any_value', salt)
    })

    test('Retorn  um hash com sucesso',async () => {
        const salt = 12
        const sut = new BcryptAdapter(salt)
        const hash = await sut.encrypt('any_value')
        expect(hash).toBe('hash')
    })
})