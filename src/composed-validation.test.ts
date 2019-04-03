import { validate, isEmail } from './composed-validation';

describe('validate()', () => {
  it('calls each given middleware function', () => {
    const mockValidator = jest.fn();
    const secondMockValidator = jest.fn();

    validate(mockValidator, secondMockValidator)('foo bar baz');

    expect(mockValidator).toHaveBeenCalledWith('foo bar baz');
    expect(secondMockValidator).toHaveBeenCalledWith('foo bar baz');
  });

  it('returns the first error encountered', () => {
    const mockValidator = jest.fn();
    const secondMockValidator = jest.fn(() => 'SECOND_MOCK_VALIDATOR_ERROR');
    const thirdMockValidator = jest.fn(() => 'THIRD_MOCK_VALIADTOR_ERROR');

    const errMsg = validate(
      mockValidator,
      secondMockValidator,
      thirdMockValidator
    )('foo bar baz');

    expect(errMsg).toEqual('SECOND_MOCK_VALIDATOR_ERROR');
    expect(thirdMockValidator).not.toHaveBeenCalled();
  });
});

describe('isEmail()', () => {
  it('returns an error if the email is in the wrong format', () => {
    const errMsg = validate(isEmail())('not_a_valid_email');
    expect(errMsg).toBeTruthy();
  });

  it('does not return an error if the email is in the correct format', () => {
    const errMsg = validate(isEmail())('a_valid_email@example.com');
    expect(errMsg).toBe(undefined);
  });

  it('can return a custom error message', () => {
    const errMsg = validate(isEmail('My custom message'))('not_a_valid_email');
    expect(errMsg).toEqual('My custom message');
  });
});
