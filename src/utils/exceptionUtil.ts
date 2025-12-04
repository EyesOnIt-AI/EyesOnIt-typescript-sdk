type ErrorWithMessage = {
    message: string
}

export class ExceptionUtil {
    private static isErrorWithMessage(error: unknown): error is ErrorWithMessage {
        return (
            typeof error === 'object' &&
            error !== null &&
            'message' in error &&
            typeof (error as Record<string, unknown>).message === 'string'
        )
    }

    private static toErrorWithMessage(maybeError: unknown): ErrorWithMessage {
        if (ExceptionUtil.isErrorWithMessage(maybeError)) return maybeError

        try {
            var errorJSON = JSON.stringify(maybeError);
            console.log(errorJSON);
            
            var error = new Error(errorJSON);
            return error;
        } catch {
            // fallback in case there's an error stringifying the maybeError
            // like with circular references for example.
            return new Error(String(maybeError))
        }
    }

    public static getErrorMessage(error: unknown) {
        return ExceptionUtil.toErrorWithMessage(error).message
    }

    public static writeExceptionToConsole(error: unknown) {
        if (typeof error === 'object' && error !== null && 'stack' in error) {
            console.error(`Error: ${error.stack}`);
        }
        else {
            let message = ExceptionUtil.getErrorMessage(error);
            console.error(`Error: ${message}. Stack trace not available.`);
        }
    }

    public static logException(logger: any, error: unknown) {
        let message = ExceptionUtil.getErrorMessage(error);
        logger.error(`Error: ${message}`);

        if (typeof error === 'object' && error !== null && 'stack' in error) {
            logger.error(`Error stack trace: ${error.stack}`);
        }
    }
}