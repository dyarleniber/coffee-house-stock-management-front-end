export const getAPIValidationError = (response, message) => {
  const defaultMessage = "Something went wrong, try again later";
  const { status, data } = response || {};
  switch (status) {
    case 400:
    case 401:
    case 403: {
      const error = data?.errors?.[0];
      if (error && typeof error === "string") {
        return error;
      }

      return message || defaultMessage;
    }
    default: {
      return defaultMessage;
    }
  }
};
