import bcrypt from 'bcrypt'
import { BcryptAdapter } from '../src/infra/cryptography/bcrypt-adapter'

jest.mock('bcrypt', () => ({
    async hash(): Promise<string> {
        return new Promise(resolve => resolve('hash'))
    }
}))
const salt = 12
const makesut = (): BcryptAdapter => {
    return new BcryptAdapter(salt)
}

describe('Bcrypt Adapter', () => {
    test('Bcrypt seja chamado com os valores corretos', async () => {
        const sut = makesut()
        const hashSpy = jest.spyOn(bcrypt, 'hash')
        await sut.encrypt('any_value')
        expect(hashSpy).toHaveBeenCalledWith('any_value', salt)
    })

    test('Retorn uma hash com sucesso', async () => {
        const sut = makesut()
        const hash = await sut.encrypt('any_value')
        expect(hash).toBe('hash')
    })

})