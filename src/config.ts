import 'dotenv/config';

export interface EnvConfig {
    apiKey: string;
    host: string;
    alertsUid: Record<string, string[]>
}

declare type Config = {
    [env: string]: EnvConfig
};

/**
 * Put your credential config here
 */
const config: Config  = {
    qa: {
        apiKey: process.env.QA_ENV_API_KEY as string,
        host: process.env.QA_ENV_HOST as string,
        alertsUid: {
            fomo: ["nTf8gvZIz"]
        }
    },
    stage: {
        apiKey: process.env.STAGE_ENV_API_KEY as string,
        host: process.env.STAGE_ENV_HOST as string,
        alertsUid: {
            fomo: ["fKFrjFR4k"]
        }
    },
    testnet: {
        apiKey: process.env.TESTNET_ENV_API_KEY as string,
        host: process.env.TESTNET_ENV_HOST as string,
        alertsUid: {
            fomo: ["lEIQCKgVk"]
        }
    },
    live: {
        apiKey: process.env.LIVE_ENV_API_KEY as string,
        host: process.env.LIVE_ENV_HOST as string,
        alertsUid: {
            fomo: ["0DQaUp9Mz", "ZWnKqf37k"]
        }
    }
};

export function getConfig(env: string): EnvConfig {
    const envConfig: EnvConfig = config[env];
    if (envConfig !== undefined) {
        return envConfig;
    }
    throw new Error(`No config found for env ${env}`);
}
