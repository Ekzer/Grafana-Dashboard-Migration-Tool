## Grafana Dashboard Migration tool
Simple tool to migrate Grafana dashboards from one Grafana instance to another. It uses the Grafana API to export and import dashboards.

This will clean panel ids, and then copy all panels and alerts. It will create the folder to the destination Grafana instance if it does not exist.

For example: from dev to staging, from staging to prod;

⚠ Requires exact dashboard name for now.

### Usage
1. ```npm install```
2. Copy ```.env.template``` file to ```.env``` and Fill it with the source and destination Grafana URLs and API keys and alerts if needed
3. ```npm run build```
4. ```npm run grafana-migration -- --source <source-env> --destination <destination-env> --name <dashboard-name>```
5. Example: ```npm run grafana-migration -- --source qa --destination stage --name "My Beautiful Dashboard" ```
6. You can use anoher env file by passing the parameter `-e` or `--env` : `-e "./anotherenvfile"`

### Usage CLI

1. ```npm install -g grafana-migrations```
2. ```grafana-migration --source qa --destination stage --name "My Beautiful Dashboard" -e '.env' ```
