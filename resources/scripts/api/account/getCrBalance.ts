import http, { FractalResponseData } from '@/api/http';

export interface CrBalanceData {
    // eslint-disable-next-line camelcase
    cr_balance: string;
}

export const rawDataToCrBalance = (data: FractalResponseData): CrBalanceData => ({
    cr_balance: data.attributes.cr_balance,
});

export default (): Promise<CrBalanceData> => {
    return new Promise((resolve, reject) => {
        http.get('/api/client/account')
            .then(({ data }) => resolve((data.data || []).map(rawDataToCrBalance)))
            .catch(reject);
    });
};
