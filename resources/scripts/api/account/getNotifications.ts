import http from '@/api/http';

export interface Notification {
    id: number;
    userId: number;
    serverId: number | null;
    action: string;
    created: string | null;
}

export const rawDataToNotification = (data: any): Notification => ({
    id: data.id,
    userId: data.user_id,
    serverId: data.server_id ?? null,
    action: data.action,
    created: data.created,
});

export default (): Promise<Notification[]> => {
    return new Promise((resolve, reject) => {
        http.get('/api/client/account/notifications')
            .then(({ data }) => resolve((data.data || []).map((d: any) => rawDataToNotification(d.attributes))))
            .catch(reject);
    });
};
