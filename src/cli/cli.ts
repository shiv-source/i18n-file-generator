#!/usr/bin/env node

import yargs from "yargs"
import * as path from "path"
import fs from "fs-extra"
import { logger } from "../logger"
import { Config } from "../interfaces"

const appDir: string = path.resolve("./")

export const cliArgs = () => {
    const argv = yargs.options({
        config: {
            describe: "The path to the JavaScript configuration file is typically set to 'i18n-config.js' by default.",
            type: "string",
            default: "i18n.config.js"
        },
        provider: {
            describe: "Please provide a name for the service provider.",
            type: "string"
        },
        accessKeyId: {
            describe: "Kindly supply the AWS secretAccessKey for authentication.",
            type: "string"
        },
        secretAccessKey: {
            describe: "Kindly furnish the AWS secretAccessKey for authentication.",
            type: "string"
        }
    }).argv as {
        config: string
        provider?: string
        accessKeyId?: string
        secretAccessKey?: string
    }

    const configFilePath = argv.config

    if (configFilePath) {
        try {
            let config = {}

            const provider = argv.provider
            const accessKeyId = argv.accessKeyId
            const secretAccessKey = argv.secretAccessKey
            const absolutePath = path.resolve(appDir, configFilePath)

            const isConfigExists = fs.pathExistsSync(absolutePath)
            if (isConfigExists) {
                config = require(absolutePath)
            }

            if (provider) config = { ...config, provider }
            if (accessKeyId) config = { ...config, accessKeyId }
            if (secretAccessKey) config = { ...config, secretAccessKey }

            return config as Config
        } catch (error) {
            logger.error("Error loading config file", error)
        }
    }
}
