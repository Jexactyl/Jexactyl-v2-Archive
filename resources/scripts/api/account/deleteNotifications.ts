import http from '@/api/http';

export default (): Promise<void> => {
    return new Promise((resolve, reject) => {
        http.delete('/api/client/account/notifications')
            .then(() => resolve())
            .catch(reject);
    });
};
