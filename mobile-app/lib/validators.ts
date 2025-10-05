export function validateEmail(input: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(input);
}

export function validateNamePart(input: string): boolean {
    // Allows only letters, no spaces or symbols, at least 3 characters
    const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ]{3,}$/;
    return nameRegex.test(input);
}

export function validatePassword(input: string): boolean {
    // At least 8 characters, one uppercase, one lowercase, one number, one special character
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    return passwordRegex.test(input);
}