import axios from "axios";
import {EnvConfig} from '../config';

export async function get(url: string, config: EnvConfig, params: any = {}) {
    try {
        const {data} = await axios.get(`${config.host}/${url}`, {
            headers: {
                'Authorization': `Bearer ${config.apiKey}`
            },
            params
        });
        return data;
    } catch (e) {
        console.error(e);
        throw e;
    }
}

export async function post(url: string, body: any, config: EnvConfig) {
    try {
        const {data} = await axios.post(`${config.host}/${url}`, body, {
            headers: {
                'Authorization': `Bearer ${config.apiKey}`
            },
        });
        return data;
    } catch (e) {
        console.error(e);
        throw e;
    }
}
