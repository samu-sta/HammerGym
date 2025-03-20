
import { useState } from 'react';

const useAuth = (schemaFn, submitFn, onSuccessFn, onErrorFn) => {
  const [errors, setErrors] = useState({});

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);

    const formValues = {};
    for (let [key, value] of formData.entries()) {
      formValues[key] = value;
    }

    const result = schemaFn(formValues);
    if (!result.success) {
      const formattedErrors = result.error.format();
      setErrors(formattedErrors);
      return;
    }

    setErrors({});

    const response = await submitFn(formValues);

    if (!response.success) {
      onErrorFn(response, setErrors);
      return;
    }
    onSuccessFn(response);

  };

  return {
    errors,
    setErrors,
    handleSubmit
  };
};

export default useAuth;