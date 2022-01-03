import http from '@/api/http';

export interface CrBalanceData {
    // eslint-disable-next-line camelcase
    cr_balance: string;
}

export default (): Promise<CrBalanceData> => {
    return new Promise((resolve, reject) => {
        http.get('/api/client/account')
            .then(({ data }) => resolve(data.data))
            .catch(reject);
    });
};
