import http from '@/api/http';

export interface CrBalanceData {
    // eslint-disable-next-line camelcase
    cr_balance: string;
}

export const rawDataToCrBalance = (data: any): CrBalanceData => ({
    cr_balance: data.cr_balance,
});

export default (): Promise<CrBalanceData> => {
    return new Promise((resolve, reject) => {
        http.get('/api/client/account')
            .then(({ data }) => resolve((data.data || []).map((d: any) => rawDataToCrBalance(d.attributes))))
            .catch(reject);
    });
};
