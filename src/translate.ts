import path from "path"
import fs from "fs-extra"
import dot from "dot-object"
import { cliArgs } from "./cli"
import { logger } from "./logger"
import { awsTranslateText } from "./provider"
import { LocaleFileObject, Provider, TranslateTextParams, TranslatedText, Config } from "./interfaces"
import { unknownErrorHandler } from "./common"

export class TranslationManager {
    private appDir: string = path.resolve("./")
    /**
     * "The default provider and region can be adjusted through the configuration file and can also be modified using the 'setConfig' method."
     */
    private config: Config = {
        provider: Provider.AWS,
        accessKeyId: "",
        secretAccessKey: "",
        sourceLanguageFilePath: "",
        sourceLanguageCode: "",
        targetLanguageCodes: [],
        awsRegion: "us-east-1"
    }

    constructor(config?: Config) {
        if (config) this.config = config
    }

    private init() {
        const args = cliArgs()
        /**
         * "All options can be overridden by the CLI configuration."
         */
        this.config.provider = args?.provider ?? this.config.provider
        this.config.awsRegion = args?.awsRegion ?? this.config.awsRegion
        this.config.accessKeyId = args?.accessKeyId ?? this.config.accessKeyId
        this.config.secretAccessKey = args?.secretAccessKey ?? this.config.secretAccessKey
        this.config.sourceLanguageFilePath = args?.sourceLanguageFilePath ?? this.config?.sourceLanguageFilePath
        this.config.sourceLanguageCode = args?.sourceLanguageCode ?? this.config?.sourceLanguageCode
        this.config.targetLanguageCodes = args?.targetLanguageCodes ?? this.config?.targetLanguageCodes
        this.config.outputDirectory = args?.outputDirectory ?? this.config?.outputDirectory

        /**
         * An error will be thrown if the default configurations do not exist.
         */

        if (!this.config.provider) throw new Error("Please be aware that specifying the 'provider' is mandatory.")
        if (!this.config.awsRegion) throw new Error("Please ensure that the 'awsRegion' is provided as it is required.")
        if (!this.config.accessKeyId) throw new Error("An 'accessKeyId' is an essential requirement.")
        if (!this.config.secretAccessKey) throw new Error("The 'secretAccessKey' is a mandatory requirement.")
        if (!this.config.sourceLanguageFilePath)
            throw new Error("It appears that the 'sourceLanguageFilePath' is missing.")
        if (!this.config.sourceLanguageCode) throw new Error("It seems that the 'sourceLanguageCode' is missing.")
        if (!this.config.targetLanguageCodes) throw new Error("It appears that the 'targetLanguageCodes' are missing.")
        if (!this.config.targetLanguageCodes.length)
            throw new Error("Please note that 'targetLanguageCodes' must be an array of two-digit language codes.")
    }

    public setConfig(config: Config) {
        this.config = config
    }

    public async translate() {
        try {
            this.init()
            await this.translateI18n({
                sourceLanguageFilePath: this.config.sourceLanguageFilePath,
                sourceLanguageCode: this.config.sourceLanguageCode,
                targetLanguageCodes: this.config.targetLanguageCodes,
                outputDirectory: this.config.outputDirectory
            })
        } catch (err) {
            logger.info("Please review the configuration in your i18.config.js file.")
            logger.info(
                "You have the option to specify a custom configuration file using the --config=your_file_path flag."
            )
            unknownErrorHandler(err)
            process.exit(1)
        }
    }

    public async translateI18n({
        sourceLanguageFilePath,
        sourceLanguageCode,
        targetLanguageCodes,
        outputDirectory
    }: {
        sourceLanguageFilePath: string
        sourceLanguageCode: string
        targetLanguageCodes: string[]
        outputDirectory?: string
    }) {
        try {
            if (outputDirectory) {
                await fs.copy(
                    path.join(this.appDir, sourceLanguageFilePath),
                    `${outputDirectory}/${sourceLanguageCode}.json`
                )
            }
            const sourceFileDirectory = path.dirname(sourceLanguageFilePath)
            outputDirectory = outputDirectory ?? sourceFileDirectory
            await fs.ensureDir(outputDirectory)

            const sourceLocaleObj: LocaleFileObject = await fs.readJSON(path.join(this.appDir, sourceLanguageFilePath))

            if (!Array.isArray(targetLanguageCodes)) {
                const error = new Error('Please pass targetLanguageCodes as array of language codes, e.g. ["fr", "hi"]')
                logger.error(error.message)
                throw error
            }

            Promise.all(
                targetLanguageCodes.map(async (language: string) => {
                    return await this.translateAndWriteJson(
                        sourceLanguageCode,
                        language,
                        sourceLocaleObj,
                        outputDirectory!
                    )
                })
            )
                .then(() => {
                    logger.success(`Tranlatations file has been created for ${targetLanguageCodes} .`)
                })
                .catch((err: Error) => {
                    logger.error(err.message)
                    throw err
                })
        } catch (err) {
            unknownErrorHandler(err)
            process.exit(1)
        }
    }

    public async translateText({ sourceLanguageCode, targetLanguageCode, textToTranslate }: TranslateTextParams) {
        try {
            const translatedTextResponse: TranslatedText = {
                sourceLanguageCode,
                targetLanguageCode,
                translatedText: "Translation not available"
            }

            if (this.config?.provider === Provider.AWS) {
                const awsTranslatedText = await awsTranslateText(
                    this.config,
                    sourceLanguageCode,
                    targetLanguageCode,
                    textToTranslate
                )
                translatedTextResponse.translatedText = awsTranslatedText
            } else if (this.config?.provider === Provider.GOOGLE) {
                const error = new Error("The Google Translate feature is currently in the development phase.")
                logger.info(error.message)
                throw error
            } else {
                const error = new Error("Kindly provide the 'provider' in the configuration.")
                logger.error(error.message)
                throw error
            }

            return translatedTextResponse
        } catch (err) {
            unknownErrorHandler(err)
            process.exit(1)
        }
    }

    private async translateAndWriteJson(
        sourceLanguageCode: string,
        targetLanguageCode: string,
        sourceLocaleObj: LocaleFileObject,
        outputDirectory: string
    ) {
        let generatedObj = {}
        const dottedObj = dot.dot(sourceLocaleObj)
        for (const key in dottedObj) {
            const translatedValue = await this.translateText({
                sourceLanguageCode,
                targetLanguageCode,
                textToTranslate: dottedObj[key]
            })
            generatedObj = { ...generatedObj, ...{ [key]: translatedValue.translatedText } }
        }

        generatedObj = dot.object(generatedObj)

        await fs.writeJson(`${outputDirectory}/${targetLanguageCode}.json`, generatedObj, { spaces: 2 })
        logger.success(`A translation file has been successfully generated for the ${targetLanguageCode} language.`)
    }
}
