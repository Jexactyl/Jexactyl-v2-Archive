import http from '@/api/http';

export default (username: string, password: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        http.put('/api/client/account/username', { username, password })
            .then(() => resolve())
            .catch(reject);
    });
};
