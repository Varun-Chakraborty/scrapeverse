export function validateEmail(email: unknown): string | null {
  if (typeof email !== "string" || !email.includes("@")) {
    return "Valid email is required";
  }
  return null;
}

export function validatePassword(
  password: unknown,
  label = "Password",
): string | null {
  if (typeof password !== "string" || password.length < 4) {
    return `${label} must be at least 4 characters`;
  }
  return null;
}
