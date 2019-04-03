# Composed Validators

A super lightweight set of form validation utility functions.

_Note: This is a holding spot for a pattern to handle form validations, especially in situations where something like [yup](https://github.com/jquense/yup) is overkill. It would probaby be more appropriate as a gist rather than a repo/unpublished package. YOLO._

The general idea is to compose form field validators out of smaller, focused functions:

```javascript
import { validate, isNumber, isRequired, isPositive, isOneOf  } from 'composed-validators;

const errorMessage = validate(number(), isPositive())('-100')
// => 'Must be positive'

const errorMessage = validate(isRequired())('')
// => 'Required'

const errorMessage = validate(isOneOf(['admin', 'superAdmin']))('not an admin')
// => 'Must be "admin" or "superAdmin"'
```

Example use in React:

```javascript
import React, { useState } from 'react';
import { validate, isEmail, isRequired } from 'composed-validators';

const validateEmail = validate(
  isEmail("Are you sure that's a real email address?"),
  isRequired(
    'We need your email so we can send you our sweet sweet marketing content'
  )
);

export const SimpleForm = () => {
  const [email, setEmail] = useState('');
  const [submitFailed, setSubmitFailed] = useState(false);
  const errorMessage = validateEmail(email);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (errorMessage) {
      setSubmitFailed(true);
      return;
    }

    // do something with email...
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="email">Email address</label>
      <input
        id="email"
        type="email"
        onChange={(e) => setEmail(e.target.value)}
        value={email}
      />
      {errorMessage && submitFailed && <span>{errorMessage}</span>}

      <button type="submit">Submit</button>
    </form>
  );
};
```
