const getErrorMessage = (error: string, source: string) => {
  if (error === "invalid_data") {
    return source === "signup"
      ? "Something went wrong during signup. Please try again."
      : "Login failed. Please try again.";
  }
  if (error === "missing_data") {
    return source === "signup"
      ? "Signup information is incomplete. Please try again."
      : "Login information is missing. Please try again.";
  }
  return "An unexpected error occurred. Please try again.";
};

export default getErrorMessage;