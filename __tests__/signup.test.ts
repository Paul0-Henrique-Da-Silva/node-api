import { SigUpController } from '../src/presentation/controllers/signup'
import { MissingParamError, InvalidParamError, ServerError } from '../src/presentation/errors/index'
import { EmailValidator } from '../src/presentation/protocols/emailValidator'
import { AccountModel } from '../src/domain/models/account'
import { AddAccountModel, AddAccount } from '../src/domain/usercases/add-account'

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    add (account: AddAccountModel): AccountModel {
      const fakeAccount = {
        id: 'valid_id',
        name: 'valid_name',
        email: 'valid_email@gmail.com',
        password: 'valid_password'

      }
      return fakeAccount
    }
  }
  return new AddAccountStub()
}

interface SutTypes {
  sut: SigUpController
  emailValidatorStub: EmailValidator
  addAccountStub: AddAccount
}

const makesut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator()
  const addAccountStub = makeAddAccount()
  const sut = new SigUpController(emailValidatorStub, addAccountStub)
  return { sut, emailValidatorStub, addAccountStub }
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
        password: 'any_password',
        passwordConfirm: 'invalidid_password'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('passwordConfirm'))
  })

  test('Se a senha password e PasswordConfim não são iguais, "return erro code 400"', () => {
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

  test('Chame EmailValidator com email correto', () => {
    const { sut, emailValidatorStub } = makesut()
    const isValid = jest.spyOn(emailValidatorStub, 'isValid')
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@gmail.com',
        password: 'any_password',
        passwordConfirm: 'any_password'
      }
    }
    sut.handle(httpRequest)
    expect(isValid).toHaveBeenCalledWith('any_email@gmail.com')
  })

  test('Retorne erro 500 se o "EmailValidator" tiver uma exceção', () => {
    const { sut, emailValidatorStub } = makesut()
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@gmail.com',
        password: 'any_password',
        passwordConfirm: 'any_password'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  test('Criar uma conta  com valores correto', () => {
    const { sut, addAccountStub } = makesut()
    const addSpy = jest.spyOn(addAccountStub, 'add')
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@gmail.com',
        password: 'any_password',
        passwordConfirm: 'any_password'
      }
    }
    sut.handle(httpRequest)
    expect(addSpy).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'any_email@gmail.com',
      password: 'any_password'
    })
  })

  test('Retorne erro 500 se o "AddAccount" tiver uma exceção', () => {
    const { sut, addAccountStub } = makesut()
    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(() => {
      throw new Error()
    })
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@gmail.com',
        password: 'any_password',
        passwordConfirm: 'any_password'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  test('Email valido, "return code 200"', () => {
    const { sut } = makesut()
    const httpRequest = {
      body: {
        name: 'valid_name',
        email: 'valid_email@gmail.com',
        password: 'valid_password',
        passwordConfirm: 'valid_password'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toEqual({
      id: 'valid_id',
      name: 'valid_name',
      email: 'valid_email@gmail.com',
      password: 'valid_password'
    })
  })
})
