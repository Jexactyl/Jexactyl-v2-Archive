import http from '@/api/http';

export interface Notification {
    id: number;
    createdAt: Date | null;
    updatedAt: Date | null;
}

export const rawDataToNotification = (data: any): Notification => ({
    id: data.id,
    createdAt: data.created_at ? new Date(data.created_at) : null,
    updatedAt: data.updated_at ? new Date(data.updated_at) : null,
});

export default (): Promise<Notification[]> => {
    return new Promise((resolve, reject) => {
        http.get('/api/client/account/notifications')
            .then(({ data }) => resolve((data.data || []).map((d: any) => rawDataToNotification(d.attributes))))
            .catch(reject);
    });
};
