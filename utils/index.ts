export const isTokenInvalidOrUnauthorized = (errorMessage: string): boolean => {
  return errorMessage.includes('token invalid') || errorMessage.includes('unauthorized');
};
