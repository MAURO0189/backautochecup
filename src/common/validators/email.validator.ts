export class EmailValidator {
  static validate(email: string): string[] {
    const errors: string[] = [];
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      errors.push('El email no tiene un formato válido.');
    }
    return errors;
  }
}
