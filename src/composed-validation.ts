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

export function isEmail(customMsg?: string): ValidatorFunc {
  return (value) => {
    const emailRegex = new RegExp(/.*@.*\..*/);

    if (!emailRegex.test(value)) {
      return customMsg || 'Invalid email format';
    }
  };
}

export function isRequired(customMsg?: string): ValidatorFunc {
  return (value) => {
    let error;

    if (value === undefined || value === null || value === '') {
      error = customMsg || 'Required';
    }

    return error;
  };
}

export function isOneOf(options: string[], customMsg?: string): ValidatorFunc {
  return (value) => {
    let error;

    if (!options.includes(value)) {
      // Eww. But it's tested, so...
      const optionsWithOr = `${options.slice(0, -1).join(', ')}${
        options.length > 2 ? ',' : ''
      } or ${options[options.length - 1]}`;

      error = customMsg || `Must be ${optionsWithOr}`;
    }

    return error;
  };
}
