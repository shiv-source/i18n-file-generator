import { Signale } from "signale"

const options = {
    types: {
        success: {
            badge: "✔",
            color: "green",
            label: "[success]"
        },
        info: {
            badge: "ℹ",
            color: "blue",
            label: "[info]"
        },
        warning: {
            badge: "⚠",
            color: "yellow",
            label: "[warning]"
        },
        error: {
            badge: "✖",
            color: "red",
            label: "[error]"
        }
    },
    format: (options: { label: string }, args: unknown[]) => {
        const label = options.label
        const message = args[0]

        return `[${label}] ${message}`
    }
}

export const logger = new Signale(options)
