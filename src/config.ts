import 'dotenv/config';
import assert from "node:assert/strict";

export interface EnvConfig {
    apiKey: string;
    host: string;
    alertsUids?: string[]
}

export function getConfig(env: string, isDestination: boolean = false): EnvConfig {
    const processEnv = process.env
    const apiKey = processEnv[`${env.toUpperCase()}_ENV_API_KEY`]
    assert.ok(!!apiKey, `Env variable API_KEY for env ${env} was not set`)

    const host = processEnv[`${env.toUpperCase()}_ENV_HOST`]
    assert.ok(!!host, `Env variable HOST for env ${env} was not set`)
    console.info(`Using Host: ${host}`)

    const alertsUids = processEnv[`${env.toUpperCase()}_ENV_ALERTS_UID`]?.split(",")
    if (isDestination) {
        console.info(`Using Alerts UIDs: ${alertsUids?.join(" ")}`)
    }

    const config: EnvConfig = {
        apiKey,
        host,
        alertsUids,
    }
    return config;
}
