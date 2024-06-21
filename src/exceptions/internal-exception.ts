import { HttpException } from "./root";

export class InternalException extends HttpException {
    constructor(message: string, error: any, errorCode: number) {
        super(message, error, 500, errorCode);
    }
}