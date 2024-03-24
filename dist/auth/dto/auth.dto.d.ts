export declare class RegisterDTO {
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    password: string;
}
export declare class SignInDTO {
    email: string;
    password: string;
}
export declare class AccountRecoveryDTO {
    email: string;
}
export declare class ConfirmAccountRecoveryTokenDTO extends AccountRecoveryDTO {
    token: string;
}
export declare class NewPasswordDTO {
    code: string;
    newPassword: string;
}
