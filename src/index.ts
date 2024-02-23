import * as GrafanaService from './services/GrafanaService';
import {program} from "commander";
import {Config} from "./config";
import * as process from 'process';
import {Grafana} from "./types/grafana";
import * as MigrationService from "./services/MigrationService";
import CreateDashboardRequest = Grafana.CreateDashboardRequest;

async function main() {
    program
        .requiredOption('-s, --source <env name>', 'Source grafana env name')
        .requiredOption('-d, --destination <env name>', 'Destination grafana env name')
        .requiredOption('-n, --name <dashboard name>', 'Dashboard name')
        .option('-e, --env <file name>', 'ENV file name')
        .parse();

    const options = program.opts();


    const config = new Config(options.env)

    console.info("----- Source Env ------")
    const sourceEnv = config.getConfig(options.source);
    console.info("----- Destination Env ------")
    const destEnv = config.getConfig(options.destination, true);
    console.info("----- Dashboard ------")
    console.info(`Name: ${options.name}\n`)

    const searchDashboardResults = await GrafanaService.search({
        query: options.name,
        // Do not exist in version below 9.0
        dashboardUID: options.uid
    }, sourceEnv);


    if (searchDashboardResults.length > 1) {
        throw new Error(`More than one dashboard found. Please specify dashboard UID:\n ${searchDashboardResults.map(d => {
            return `${d.uid} - ${d.title}\n`
        })}`);
    } else if (searchDashboardResults.length === 0) {
        throw new Error(`No dashboard found`);
    }

    let [sourceDashboard, destDashboard] = await Promise.all([
        GrafanaService.getDashboardByUID(searchDashboardResults[0].uid, sourceEnv),
        GrafanaService.getDashboardByUID(searchDashboardResults[0].uid, destEnv)
    ]);
    sourceDashboard = MigrationService.cleanDashboard(sourceDashboard!, destEnv)

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
