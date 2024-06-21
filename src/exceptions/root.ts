export class HttpException extends Error {
    message: string;
    errorCode: any;
    statusCode: number;
    error: ErrorCode;

    constructor(message: string, errorCode: ErrorCode, statusCode: number, error: any) {
        super(message);
        this.message = message;
        this.errorCode = errorCode;
        this.statusCode = statusCode;
        this.error = error;
    }
}

export enum ErrorCode {
    USER_NOT_FOUND = 1001,
    USER_ALREADY_EXISTS = 1002,
    INVALID_CREDENTIALS = 1003,
    UNPROCESSABLE_ENTITY = 2001,
    INTERNAL_EXECPTION = 3001,

    NO_TOKEN = 4001,
    INVALID_TOKEN_FORMAT = 4002,
    INVALID_TOKEN = 4003
}