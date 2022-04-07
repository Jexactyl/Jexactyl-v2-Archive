import http from '@/api/http';

export interface Notification {
    id: number;
    userId: number;
    serverId: number | null;
    action: string;
    createdAt: Date | null;
}

export const rawDataToNotification = (data: any): Notification => ({
    id: data.id,
    userId: data.user_id,
    serverId: data.server_id ?? null,
    action: data.action,
    createdAt: data.created_at ? new Date(data.created_at) : null,
});

export default (): Promise<Notification[]> => {
    return new Promise((resolve, reject) => {
        http.get('/api/client/account/notifications')
            .then(({ data }) => resolve((data.data || []).map((d: any) => rawDataToNotification(d.attributes))))
            .catch(reject);
    });
};
