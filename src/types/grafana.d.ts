export namespace Grafana {
    export interface Dashboard {
        id: number;
        panels: any[];
        uid: string;
        title: string;
        tags: string[];
        timezone: string;
        schemaVersion: number;
        version: number;
        refresh: string;
    }

    export interface DashboardMeta {
        isStarred: boolean;
        url: string;
        folderId: number;
        folderUid: string;
    }
    /**
     * https://grafana.com/docs/grafana/latest/developers/http_api/dashboard/
     */
    export interface CreateDashboardRequest {
        dashboard: Dashboard;
        folderId?: number;
        folderUid?: string;
        message?: string;
        overwrite?: boolean;
        refresh?: boolean;
    }

    export interface CreateFolderRequest {
        uid?: string;
        title: string;
    }

    /**
     *
     */
    export interface Folder {
        id: number;
        uid: string;
        title: string;
        url: string;
        hasAcl: boolean;
        canSave: boolean;
        canEdit: boolean;
        canAdmin: boolean;
        createdBy: string;
        created: string;
        updatedBy: string;
        updated: string;
        version: number;
    }
    /**
     * https://grafana.com/docs/grafana/latest/developers/http_api/dashboard/#get-dashboard-by-uid
     */
    export interface GetDashboardResponse {
        dashboard: Dashboard;
        meta: DashboardMeta;
    }

    /**
     * https://grafana.com/docs/grafana/latest/developers/http_api/folder_dashboard_search/#folderdashboard-search-api
     */
    export interface SearchResponse {
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
    export interface SearchParams {
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
