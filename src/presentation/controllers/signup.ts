import { HttpRequest, HttpResponse } from '../protocols/http'
import { MissingParamError, InvalidParamError } from '../errors/index'
import { badRequest, serverError, ok } from '../helpers/http-helper'
import { EmailValidatorAdapter }  from '../../utils/email-validator-adapter.'
import { AddAccount } from '../../domain/usercases/add-account'

export class SigUpController {
  private readonly emailValidator: EmailValidatorAdapter
  private readonly addAccount: AddAccount

  constructor (emailValidator: EmailValidatorAdapter, addAccount: AddAccount) {
    this.emailValidator = emailValidator
    this.addAccount = addAccount
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requireFields = ['name', 'email', 'password', 'passwordConfirm']
      for (const field of requireFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }
      const { name, email, password, passwordConfirm } = httpRequest.body

      if (password !== passwordConfirm) {
        return badRequest(new InvalidParamError('passwordConfirm'))
      }
      const isValid = this.emailValidator.isValid(email)
      if (!isValid) {
        return badRequest(new InvalidParamError('email'))
      }
      const account = await this.addAccount.add({ email, name, password })
      return ok(account)

    } catch (error) {
      return serverError()
    }
  }
}
