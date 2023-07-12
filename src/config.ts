import 'dotenv/config';

export interface EnvConfig {
    apiKey: string;
    host: string;
}

declare type Config = {
    [env: string]: EnvConfig
};

/**
 * Put your credential config here
 */
const config: Config  = {
    dev: {
        apiKey: process.env.DEV_ENV_API_KEY as string,
        host: process.env.DEV_ENV_HOST as string
    },
    prod: {
        apiKey: process.env.PROD_ENV_API_KEY as string,
        host: process.env.PROD_ENV_HOST as string
    }
};

export function getConfig(env: string): EnvConfig {
    const envConfig: EnvConfig = config[env];
    if (envConfig !== undefined) {
        return envConfig;
    }
    throw new Error(`No config found for env ${env}`);
}
