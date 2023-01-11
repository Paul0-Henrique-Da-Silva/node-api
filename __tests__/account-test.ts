// const { MongoClient } = require('mongodb');

// describe("Account Mongo Repository", () => {
//     let connection

//     beforeAll(async () => {
    
//     })

//     afterAll(() => {

//     })
    
//     test('retorna uma conta com sucesso', async () => {
//         const sut = new AccountMongoRepository()
//         const account = await sut.add({
//             name: 'any_name',
//             email: 'any_email@mail.com',
//             password: 'any_password'
//         })
//         expect(account).toBeTruthy()
//         expect(account.id).toBeTruthy()
//         expect(account.name).toBe('any_name')
//         expect(account.email).toBe('any_email@mail.com')
//         expect(account.name).toBe('any_password')
//     })
// })