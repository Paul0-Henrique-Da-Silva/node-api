import { HttpRequest, HttpResponse } from '../protocols/http'
import { MissingParamError, InvalidParamError } from '../errors/index'
import { badRequest, serverError } from '../helpers/http-helper'
import { EmailValidator } from '../protocols/emailValidator'

export class SigUpController {
  private readonly emailValidator: EmailValidator
  constructor (emailValidator: EmailValidator) {
    this.emailValidator = emailValidator
  }

  handle (httpRequest: HttpRequest): HttpResponse {
    try {
      const requireFields = ['name', 'email', 'password', 'passwordConfirm']
      for (const field of requireFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }
      const { email, password, passwordConfirm } = httpRequest.body

      if (password !== passwordConfirm) {
        return badRequest(new InvalidParamError('passwordConfirm'))
      }
      const isValid = this.emailValidator.isValid(email)
      if (!isValid) {
        return badRequest(new InvalidParamError('email'))
      }
    } catch (error) {
      return serverError()
    }
  }
}
