import { EmailValidatorAdapter } from '../src/utils/email-validator'
import validator from 'validator'

describe('EmailValidator', () => {
  test('Se retorno for falso , retorne "false"', () => {
    const sut = new EmailValidatorAdapter()
    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false)
    const isValid = sut.isValid('invalid_email@gmail.com')
    expect(isValid).toBe(false)
  })
  test('Se retorno for verdadeiro , retorne "true"', () => {
    const sut = new EmailValidatorAdapter()
    const isValid = sut.isValid('invalid_email@gmail.com')
    expect(isValid).toBe(true)
  })
})
