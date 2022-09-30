import { SigUpController } from '../src/presentation/controllers/signup'

describe('SinUp Controllers', () => {
  test('Nome não for aprovado, "return erro code 400"', () => {
    const sut = new SigUpController()
    const httpRequest = {
      body: {
        email: 'any_email@gmail.com',
        password: 'any_password',
        passwordConfirm: 'any_password'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new Error('Missing param: name'))
  }
  )
})
