## Grafana Dashboard Migration tool
Simple tool to migrate Grafana dashboards from one Grafana instance to another. It uses the Grafana API to export and import dashboards.

This will copy all panels, alerts. It will create the folder to the destination Grafana instance if it does not exist.

For example: from dev to staging, from staging to prod;

⚠ Requires exact dashboard name for now.

### Usage
1. ```npm install```
2. Fill the ```.env``` file with the source and destination Grafana URLs and API keys
3. Map the env config to ```src/config.ts```
4. ```npm run build```
5. ```npm run grafana-migration -- --source <source-env> --destination <destination-env> --dashboard <dashboard-name>```
