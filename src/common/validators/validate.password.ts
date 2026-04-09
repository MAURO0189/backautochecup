export class ValidatePassword {
  static validate(password: string): string[] {
    const errors: string[] = [];

    if (password.length < 8) {
      errors.push('La contraseña debe tener al menos 8 caracteres.');
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('La contraseña debe contener al menos una letra mayúscula.');
    }
    if (!/[a-z]/.test(password)) {
      errors.push('La contraseña debe contener al menos una letra minúscula.');
    }
    if (!/\d/.test(password)) {
      errors.push('La contraseña debe contener al menos un número.');
    }
    if (!/[@$!%*?&]/.test(password)) {
      errors.push('La contraseña debe contener al menos un carácter especial.');
    }
    return errors;
  }
}
