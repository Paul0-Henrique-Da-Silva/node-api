import { SigUpController } from '../src/presentation/controllers/signup'
import { MissingParamError } from '../src/presentation/errors/missing-param-error'
import { InvalidParamError } from '../src/presentation/errors/invalid-param-error'
import { EmailValidator } from '../src/presentation/protocols/emailValidator'

interface SutTypes {
  sut: SigUpController
  emailValidatorStub: EmailValidator
}

const makesut = (): SutTypes => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  const emailValidatorStub = new EmailValidatorStub()
  const sut = new SigUpController(emailValidatorStub)
  return { sut, emailValidatorStub }
}

describe('SinUp Controllers', () => {
  test('Nome não for aprovado, "return erro code 400"', () => {
    const { sut } = makesut()
    const httpRequest = {
      body: {
        email: 'any_email@gmail.com',
        password: 'any_password',
        passwordConfirm: 'any_password'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('name'))
  })

  test('Email não for aprovado, "return erro code 400"', () => {
    const { sut } = makesut()
    const httpRequest = {
      body: {
        name: 'any_name',
        password: 'any_password',
        passwordConfirm: 'any_password'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })

  test('Password não for aprovado, "return erro code 400"', () => {
    const { sut } = makesut()
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@gmail.com',
        passwordConfirm: 'any_password'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })

  test('PasswordConfirm não for aprovado, "return erro code 400"', () => {
    const { sut } = makesut()
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@gmail.com',
        password: 'any_password'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('passwordConfirm'))
  })
  test('Email invalido, "return erro code 400"', () => {
    const { sut, emailValidatorStub } = makesut()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@gmail.com',
        password: 'any_password',
        passwordConfirm: 'any_password'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('email'))
  })
})
