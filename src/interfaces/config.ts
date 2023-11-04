import { Provider } from "./provider"

export interface Config {
    provider: Provider
    accessKeyId: string
    secretAccessKey: string
    sourceLanguageFilePath: string
    sourceLanguageCode: string
    targetLanguageCodes: Array<string>
    awsRegion?: string
    outputDirectory?: string
}
