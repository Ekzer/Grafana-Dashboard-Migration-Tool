import * as RequestService from './RequestService';
import {Grafana} from "../types/grafana";
import SearchResponse = Grafana.SearchResponse;
import GetDashboardResponse = Grafana.GetDashboardResponse;
import SearchParams = Grafana.SearchParams;
import CreateDashboardRequest = Grafana.CreateDashboardRequest;
import {EnvConfig} from '../config';

/**
 * Will return exact object matched by name. There should be unique names so only one result.
 * @param params
 * @param config env config with host and apiKey
 * @returns {Promise<*>}
 */
export async function search(params: SearchParams, config: EnvConfig) {
    try {
        return await RequestService.get(`search`, config, params) as SearchResponse[];
    } catch (e: any) {
        console.error(e);
        throw new Error(`No result found. params ${params}, host ${config.host}`);
    }
}

/**
 * https://grafana.com/docs/grafana/latest/developers/http_api/dashboard/#get-dashboard-by-uid
 * @param uid
 * @param config env config with host and apiKey
 * @returns {Promise<unknown>}
 */
export async function getDashboardByUID(uid: string, config: EnvConfig) {
    try {
        return await RequestService.get(`dashboards/uid/${uid}`, config) as GetDashboardResponse;
    } catch (e: any) {
        console.error(`No dashboard found. ${e.message} - uid ${uid}`);
        return null;
    }
}

export async function createOrUpdateDashboard(body: CreateDashboardRequest, config: EnvConfig) {
    try {
        return await RequestService.post(`dashboards/db`, body, config);
    } catch (e: any) {
        console.error(`Error during dashboard creation: config ${config}, ${e.message}, ${body}`);
        throw e;
    }
}

export async function getFolderByUid(uid: string, config: EnvConfig) {
    try {
        return await RequestService.get(`folders/${uid}`, config);
    } catch (e: any) {
        console.error(`No folder found. ${e.message} - uid ${uid}`);
        return null;
    }
}
export async function createFolder(body: any, config: EnvConfig) {
    try {
        return await RequestService.post(`folders`, body, config);
    } catch (e: any) {
        console.error(`Error during folder creation: config ${config}, ${e.message}, ${body}`);
        throw e;
    }
}