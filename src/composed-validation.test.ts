import {
  validate,
  isEmail,
  isRequired,
  isOneOf,
  isNumber,
} from './composed-validation';

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

describe('isRequired()', () => {
  it('returns an error if the value is undefined, null, or empty string', () => {
    let errMsg = validate(isRequired())(undefined);
    expect(errMsg).toBeTruthy();

    errMsg = validate(isRequired())(null);
    expect(errMsg).toBeTruthy();

    errMsg = validate(isRequired())('');
    expect(errMsg).toBeTruthy();
  });

  it('can return a custom error message', () => {
    const errMsg = validate(isRequired('My custom message'))(undefined);
    expect(errMsg).toEqual('My custom message');
  });
});

describe('isOneOf()', () => {
  it('returns an error when the value is not in given the array of options', () => {
    const errMsg = validate(isOneOf(['admin', 'super admin']))('not an admin');
    expect(errMsg).toBeTruthy();
  });

  it('returns an error with the options joined with "or"', () => {
    let errMsg = validate(isOneOf(['admin', 'super admin']))('not an admin');
    expect(errMsg).toContain('admin or super admin');

    errMsg = validate(isOneOf(['admin', 'super admin', 'mega admin']))(
      'not an admin'
    );
    expect(errMsg).toContain('admin, super admin, or mega admin');
  });

  it('does not return an error when the value is in given the array of options', () => {
    const errMsg = validate(isOneOf(['admin', 'super admin']))('admin');
    expect(errMsg).toBe(undefined);
  });

  it('can return a custom error message', () => {
    const errMsg = validate(
      isOneOf(['admin', 'super admin'], 'My custom message')
    )('not an admin');
    expect(errMsg).toEqual('My custom message');
  });
});

describe('isNumber()', () => {
  it('returns an error when the value is not coercable into a number', () => {
    const errMsg = validate(isNumber())('1 hundred');
    expect(errMsg).toBeTruthy();
  });

  it('does not return an error when the value is coercable into a number', () => {
    const errMsg = validate(isNumber())('123');
    expect(errMsg).toBe(undefined);
  });

  it('can return a custom error message', () => {
    const errMsg = validate(isNumber('Gotta be a number, fool'))('1 hundred');
    expect(errMsg).toEqual('Gotta be a number, fool');
  });
});
