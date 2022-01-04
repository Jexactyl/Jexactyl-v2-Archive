import http from '@/api/http';

export default (name: string, cpu: number, ram: number, storage: number): Promise<any> => {
    return new Promise((resolve, reject) => {
        http.post('/api/client/store/create', {
            name, cpu, ram, storage,
        }).then((data) => {
            resolve(data.data || []);
        }).catch(reject);
    });
};
