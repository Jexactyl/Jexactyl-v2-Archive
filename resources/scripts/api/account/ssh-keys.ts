import useSWR, { ConfigInterface } from 'swr';
import useUserSWRContentKey from '@/plugins/useUserSWRContentKey';
import http, { FractalResponseList } from '@/api/http';
import { SSHKey, Transformers } from '@definitions/user';
import { AxiosError } from 'axios';

const useSSHKeys = (config?: ConfigInterface<SSHKey[], AxiosError>) => {
    const key = useUserSWRContentKey([ 'account', 'ssh-keys' ]);

    return useSWR(key, async () => {
        const { data } = await http.get('/api/client/account/ssh-keys');

        return (data as FractalResponseList).data.map((datum: any) => {
            return Transformers.toSSHKey(datum.attributes);
        });
    }, { revalidateOnMount: false, ...(config || {}) });
};

const createSSHKey = async (name: string, publicKey: string): Promise<SSHKey> => {
    const { data } = await http.post('/api/client/account/ssh-keys', { name, public_key: publicKey });

    return Transformers.toSSHKey(data.attributes);
};

const deleteSSHKey = async (fingerprint: string): Promise<void> =>
    await http.post('/api/client/account/ssh-keys/remove', { fingerprint });

export { useSSHKeys, createSSHKey, deleteSSHKey };
