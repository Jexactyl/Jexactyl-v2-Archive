import http from '@/api/http';

export default (): Promise<any> => {
    return new Promise((resolve, reject) => {
        http.post('/api/client/store/buy/ram')
            .then((data) => {
                resolve(data.data || []);
            }).catch(reject);
    });
};
