import * as GrafanaService from './services/GrafanaService';
import {program} from "commander";
import {getConfig} from "./config";
import * as process from 'process';
import {Grafana} from "./types/grafana";
import * as MigrationService from "./services/MigrationService";
import CreateDashboardRequest = Grafana.CreateDashboardRequest;

async function main() {
    program
        .requiredOption('-s, --source <env name>', 'Source grafana env name')
        .requiredOption('-d, --destination <env name>', 'Destination grafana env name')
        .requiredOption('-t, --team <env name>', 'Dashboard team owner for Alerts')
        .option('-n, --name <dashboard name>', 'Dashboard name')
        .parse();

    const options = program.opts();

    console.log(`Source env: ${options.source} / Destination env: ${options.destination}, searching for dashboard ${options.name || options.uid}...`);

    const sourceEnv = getConfig(options.source);
    const destEnv = getConfig(options.destination);
    const team = options.team;

    const searchDashboardResults = await GrafanaService.search({
        query: options.name,
        // Do not exist in version below 9.0
        dashboardUID: options.uid
    }, sourceEnv);


    if (searchDashboardResults.length > 1) {
        throw new Error(`More than one dashboard found. Please specify dashboard UID. ${searchDashboardResults.map(d => {
            return ` ${d.uid} - ${d.title} `
        })}`);
    } else if (searchDashboardResults.length === 0) {
        throw new Error(`No dashboard found`);
    }

    let [sourceDashboard, destDashboard] = await Promise.all([
        GrafanaService.getDashboardByUID(searchDashboardResults[0].uid, sourceEnv),
        GrafanaService.getDashboardByUID(searchDashboardResults[0].uid, destEnv)
    ]);
    sourceDashboard = MigrationService.cleanDashboard(team, sourceDashboard!, destEnv)
    console.log(`Source dashboard: ${sourceDashboard!.dashboard.title}/${sourceDashboard!.dashboard.uid} - Destination dashboard: ${destDashboard?.dashboard.title}/${destDashboard?.dashboard.uid}`);

    const {folderTitle, folderUid} = searchDashboardResults[0];
    const destFolder = await MigrationService.searchOrCreateFolder(folderUid, folderTitle, destEnv);

    console.log(`Destination folder: ${!destFolder ? 'General' : destFolder?.title + '/' + destFolder?.uid}`)

    const newDashboard: CreateDashboardRequest = MigrationService.buildNewDashboard(sourceDashboard!, destDashboard!, destFolder);

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
