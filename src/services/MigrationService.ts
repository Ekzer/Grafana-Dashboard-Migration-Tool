import {EnvConfig} from "../config";
import * as GrafanaService from "./GrafanaService";
import {Grafana} from "../types/grafana";

export async function createFolder(folderTitle: string|undefined, folderUid: string|undefined, envConfig: EnvConfig) {
    if (folderTitle === undefined && folderUid === undefined) {
        return Promise.resolve(null);
    } else {
        return await GrafanaService.createFolder({
            uid: folderUid,
            title: folderTitle!
        }, envConfig);
    }
}

export function buildNewDashboard(sourceDashboard: Grafana.GetDashboardResponse, destDashboard: Grafana.GetDashboardResponse, destFolder: Grafana.Folder|null) {
    if (!destDashboard) { // new dashboard to dest env
        return Object.assign({
            dashboard: Object.assign(sourceDashboard!.dashboard, {
                uid: sourceDashboard!.dashboard.uid,
                id: null,
            })
        }, destFolder ? {folderUid: destFolder.uid} : {})
    } else {
        return Object.assign({
            dashboard: Object.assign(sourceDashboard!.dashboard, {
                id: destDashboard.dashboard.id,
                uid: sourceDashboard!.dashboard.uid, // keep the same uid
            }),
            overwrite: true
        },destFolder ? {folderUid: destFolder.uid} : {})
    }
}

export async function searchOrCreateFolder(folderUid: string|undefined, folderTitle: string|undefined, envConfig: EnvConfig): Promise<Grafana.Folder | null> {
    if (folderUid) {
        const searchDestFolder = await GrafanaService.search({
            query: folderTitle
        }, envConfig);

        if  (searchDestFolder.length > 1) {
            throw new Error(`More than one folder found. Please be more specific. ${searchDestFolder.map(f => f.uid)}`);
        } else if (searchDestFolder.length === 0) {
            return createFolder(folderTitle, folderUid, envConfig);
        } else {
            return GrafanaService.getFolderByUid(searchDestFolder[0].uid, envConfig);
        }
    } else {
        console.log('No folder specified. Will be created in general folder');
        return null;
    }
}
