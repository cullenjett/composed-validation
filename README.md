# Composed Validators

A super lightweight set of form validation utility functions. _Note: this isn't a published package, it's mostly intended to be a place to store this pattern for reference_

## What is it?

The general idea is to compose form field validators out of smaller, focused functions. Packages like [yup](https://github.com/jquense/yup) are great for object schema validation, but sometimes you just don't want to add another dependency for a simple use-case. This pattern can serve as a simpler alternative:

```javascript
import {
  validate,
  isNumber,
  isRequired,
  isPositive,
  isOneOf,
} from 'composed-validators';

const errorMessage = validate(isNumber(), isPositive())('-100');
// => 'Must be positive'

const errorMessage = validate(isRequired())('');
// => 'Required'

const errorMessage = validate(isOneOf(['admin', 'superAdmin']))('not an admin');
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
