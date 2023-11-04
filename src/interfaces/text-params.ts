export interface TranslateTextParams {
    sourceLanguageCode: string
    targetLanguageCode: string
    textToTranslate: string
}

export interface LocaleFileObject {
    [key: string]: string
}
