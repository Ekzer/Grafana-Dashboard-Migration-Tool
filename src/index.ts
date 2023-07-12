import * as GrafanaService from './services/GrafanaService';
import {program} from "commander";
import {getConfig} from "./config";
import * as process from 'process';
import {Grafana} from "./types/grafana";
import CreateDashboardRequest = Grafana.CreateDashboardRequest;

async function main() {
    program
        .requiredOption('-s, --source <env name>', 'Source grafana env name')
        .requiredOption('-d, --destination <env name>', 'Destination grafana env name')
        .option('-n, --name <dashboard name>', 'Dashboard name')
        .option('--uid <dashboard uid>', 'Dashboard UID')
        .parse();

    const options = program.opts();

    console.log(`Source env: ${options.source} / Destination env: ${options.destination}, searching for dashboard ${options.name || options.uid}...`);

    const sourceEnv = getConfig(options.source);
    const destEnv = getConfig(options.destination);

    const searchDashboardResults = await GrafanaService.search({
        query: options.name,
        dashboardUID: options.uid
    }, sourceEnv);


    if (searchDashboardResults.length > 1) {
        throw new Error(`More than one dashboard found. Please specify dashboard UID. ${searchDashboardResults.map(d => d.uid)}`);
    }
    const inputDashboard = searchDashboardResults[0];

    let searchDestFolder = await GrafanaService.search({
        query: inputDashboard.folderTitle
    }, destEnv);

    if  (searchDestFolder.length > 1) {
        throw new Error(`More than one folder found. Please be more specific. ${searchDestFolder.map(f => f.uid)}`);
    }
    const [sourceDashboard, destDashboard] = await Promise.all([
        GrafanaService.getDashboardByUID(inputDashboard.uid, sourceEnv),
        GrafanaService.getDashboardByUID(inputDashboard.uid, destEnv)
    ]);

    let newDashboard: CreateDashboardRequest;
    let destFolder = null;
    if (!destDashboard) { // new dashboard to dest env
        const sourceFolder = await GrafanaService.getFolderByUid(sourceDashboard!.meta.folderUid, sourceEnv);
        if (searchDestFolder.length === 0) {
            destFolder = await GrafanaService.createFolder({
                uid: sourceDashboard!.meta.folderUid,
                title: sourceFolder.title
            }, destEnv);
        }
        newDashboard = {
            dashboard: Object.assign(sourceDashboard!.dashboard, {
                uid: sourceDashboard!.dashboard.uid,
                id: null,
            }),
            folderUid: destFolder!.uid
        }
    } else {
        newDashboard = {
            dashboard: Object.assign(sourceDashboard!.dashboard, {
                id: destDashboard.dashboard.id,
                uid: sourceDashboard!.dashboard.uid,
            }),
            folderUid: destDashboard.meta.folderUid,
            overwrite: true
        }
    }
    const result = await GrafanaService.createOrUpdateDashboard(newDashboard, destEnv);
    console.log(result);
}

main()
    .then(() => {
        console.log('Done')
        process.exit(0);
    })
    .catch((e) => {
        console.log(e);
        process.exit(1);
    });
