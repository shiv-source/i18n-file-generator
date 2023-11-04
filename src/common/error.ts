import { logger } from "../logger"

export const unknownErrorHandler = (error: unknown): void => {
    if (error instanceof Error) {
        logger.error(error.message)
    } else {
        logger.error("An unknown error occurred.")
    }
}
