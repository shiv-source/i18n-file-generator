import { TranslateClient, TranslateTextCommand } from "@aws-sdk/client-translate"
import { Config } from "../interfaces"
import { logger } from "../logger"
import { unknownErrorHandler } from "../common"

export const awsTranslateText = async (
    config: Config,
    sourceLanguage: string,
    targetLanguage: string,
    textToTranslate: string
): Promise<string> => {
    try {
        // Create a TranslateClient
        const client = new TranslateClient({
            region: config.awsRegion,
            credentials: {
                accessKeyId: config.accessKeyId,
                secretAccessKey: config.secretAccessKey
            }
        })

        // Create a TranslateTextCommand to translate text
        const translateCommand = new TranslateTextCommand({
            SourceLanguageCode: sourceLanguage,
            TargetLanguageCode: targetLanguage,
            Text: textToTranslate
        })

        // Send the translation request and wait for the response
        const response = await client.send(translateCommand)

        // Extract the translated text from the response
        return response.TranslatedText || "Translation not available"
    } catch (error) {
        logger.error("Translation error")
        unknownErrorHandler(error)
        throw error
    }
}
