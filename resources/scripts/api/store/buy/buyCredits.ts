import http from '@/api/http';

export default (value: string): Promise<any> => {
    return new Promise((resolve, reject) => {
        http.post(`/api/client/store/checkout`, { value }).then((data) => {
            resolve(data.data || []);
        }).catch(reject);
    });
};
