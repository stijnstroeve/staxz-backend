
export class ErrorType {
    static readonly NOT_ENOUGH_PARAMETERS  = new ErrorType('NOT_ENOUGH_PARAMETERS', 1, "Not enough parameters were received.");
    static readonly UNKNOWN = new ErrorType('UNKNOWN', 2, "An unknown error occurred, please report it.");
    static readonly USER_NOT_FOUND  = new ErrorType('USER_NOT_FOUND', 3, "The user was not found.");
    static readonly USER_ALREADY_EXISTS  = new ErrorType('USER_ALREADY_EXISTS', 4, "An user with this e-mail already exists.");
    static readonly INVALID_TOKEN  = new ErrorType('INVALID_TOKEN', 5, "The given token is invalid.");
    static readonly INVALID_TOKEN_SIGNATURE  = new ErrorType('INVALID_TOKEN_SIGNATURE', 6, "The given token has an invalid token signature.");
    static readonly TOKEN_EXPIRED  = new ErrorType('TOKEN_EXPIRED', 7, "The given token has been expired and can no longer be used.");
    static readonly NO_EXP_DATE_TOKEN  = new ErrorType('NO_EXP_DATE_TOKEN', 8, "The given token does not have an expiration date.");
    static readonly NOT_AUTHORIZED  = new ErrorType('NOT_AUTHORIZED', 9, "You are not authorized.");
    static readonly UNEXPECTED_PARAMETER  = new ErrorType('UNEXPECTED_PARAMETER', 13, "There was an unexpected parameter.");
    static readonly EXTERNAL_ERROR  = new ErrorType('EXTERNAL_ERROR', 14, "An error occurred from an external request.");
    static readonly NO_PERMISSION  = new ErrorType('NO_PERMISSION', 15, "You don't have permission te execute this.");
    static readonly RANK_NOT_FOUND  = new ErrorType('RANK_NOT_FOUND', 16, "Rank with level [LEVEL] not found.");
    static readonly ERROR_SAVING_REWARD  = new ErrorType('ERROR_SAVING_REWARD', 17, "An error occurred while saving the reward.");

    private constructor(public key: string, public code: number, public description: string) {}

    toString() {
        return this.key;
    }
}

