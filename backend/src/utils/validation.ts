import * as BCrypt from 'bcryptjs';

export class Validation {
  static isKePhoneNo(value: string): boolean {
    if (!value || value.trim().length < 9) {
      return false;
    }
    value = value.trim().replace(' ', '');
    if (value.length === 9) {
      value = `+254${value}`;
    }
    if (value.length === 10) {
      value = `+254${value.substring(1)}`;
    }
    if (value.length === 12) {
      value = `+${value}`;
    }
    if (!value.startsWith('+254')) {
      return false;
    }
    if (value.length !== 13) {
      return false;
    }
    value = value.substring(4);
    if (!value.startsWith('7') && !value.startsWith('1')) {
      return false;
    }
    const lastNine = /^\d{9}$/;

    return lastNine.test(value);
  }

  static formatKePhone(value: string): string {
    // This functions assumes the phone number has already been validated
    value = value.trim().replace(' ', '');
    if (value.length === 13) {
      return value;
    }
    if (value.length === 12) {
      return `+${value}`;
    }
    if (value.length === 10) {
      return `+254${value.substring(1)}`;
    }
    if (value.length === 9) {
      return `+254${value}`;
    }
  }

  static currentTimestamp(noTime = false): string {
    const val = new Date();
    const year = val.getFullYear();
    const month = val.getMonth() + 1;
    const day = val.getDate();
    const doubleDigits = (val: number) => {
      if (val > 9) {
        return val.toString();
      } else {
        return `0${val}`;
      }
    };
    const date = `${year}-${doubleDigits(month)}-${doubleDigits(day)}`;

    if (noTime) {
      return date;
    }
    const time = val.toTimeString().split(' ')[0];

    return `${date} ${time}`;
  }

  static encryptPassword(plainTextPassword: string): string {
    return BCrypt.hashSync(plainTextPassword, 12);
  }

  static isCorrectPassword(plainText: string, cipherText: string): boolean {
    return BCrypt.compareSync(plainText, cipherText);
  }
}