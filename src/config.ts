import assert from "node:assert/strict";

export interface EnvConfig {
    apiKey: string;
    host: string;
    alertsUids?: string[]
}

export class Config {
    constructor(envFile ?: string) {
        if (envFile) {
            require('dotenv').config({path: envFile})
        } else {
            require('dotenv')
        }
    }

    getConfig(env: string, isDestination: boolean = false): EnvConfig {
        const processEnv = process.env
        const apiKey = processEnv[`${env.toUpperCase()}_ENV_API_KEY`]
        assert.ok(!!apiKey, `Env variable ${env.toUpperCase()}_ENV_API_KEY is not set`)
        console.info(`Using API Key: ${apiKey.slice(0, 10)}...`)

        const host = processEnv[`${env.toUpperCase()}_ENV_HOST`]
        assert.ok(!!host, `Env variable ${env.toUpperCase()}_ENV_HOST is not set`)
        console.info(`Using Host: ${host}`)

        const alertsUids = processEnv[`${env.toUpperCase()}_ENV_ALERTS_UID`]?.split(",")
        if (isDestination) {
            console.info(`Using Alerts UIDs: ${alertsUids?.join(" ") || "None"}`)
        }

        const config: EnvConfig = {
            apiKey,
            host,
            alertsUids,
        }
        return config;
    }
}

