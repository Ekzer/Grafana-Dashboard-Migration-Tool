export namespace Grafana {
    interface Dashboard {
        id: number;
        panels: object[];
        uid: string;
        title: string;
        tags: string[];
        timezone: string;
        schemaVersion: number;
        version: number;
        refresh: string;
    }

    interface DashboardMeta {
        isStarred: boolean;
        url: string;
        folderId: number;
        folderUid: string;
    }
    /**
     * https://grafana.com/docs/grafana/latest/developers/http_api/dashboard/
     */
    interface CreateDashboardRequest {
        dashboard: Dashboard;
        folderId?: number;
        folderUid?: string;
        message?: string;
        overwrite?: boolean;
        refresh?: boolean;
    }

    /**
     * https://grafana.com/docs/grafana/latest/developers/http_api/dashboard/#get-dashboard-by-uid
     */
    interface GetDashboardResponse {
        dashboard: Dashboard;
        meta: DashboardMeta;
    }

    /**
     * https://grafana.com/docs/grafana/latest/developers/http_api/folder_dashboard_search/#folderdashboard-search-api
     */
    interface SearchResponse {
        id: number;
        uid: string;
        title: string;
        url: string;
        type: string;
        tags: string[];
        isStarred: boolean;
        folderId: number;
        folderUid: string;
        folderTitle: string;
        folderUrl: string;
        uri: string;
    }

    /**
     * https://grafana.com/docs/grafana/latest/developers/http_api/folder_dashboard_search/#folderdashboard-search-api
     */
    interface SearchParams {
        query?: string;
        tag?: string[];
        type?: string;
        dashboardIds?: string;
        dashboardUID?: string;
        dashboardUIDs?: string[];
        folderIds?: string[];
        starred?: string;
        limit?: number;
        page?: number;
    }
}
