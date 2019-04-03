type ValidatorFunc = (value: string) => string | undefined;

type Validator = (
  ...validatorFuncs: ValidatorFunc[]
) => (value: string) => string | undefined;

export const validate: Validator = (...validatorFuncs) => (value) => {
  const errorString = validatorFuncs.reduce((error, validatorFunc) => {
    return error || validatorFunc(value) || '';
  }, '');

  return errorString !== '' ? errorString : undefined;
};

export function email(): ValidatorFunc {
  return (value) => {
    const emailRegex = new RegExp(/.*@.*\..*/);

    if (!emailRegex.test(value)) {
      return 'Invalid email format';
    }
  };
}
