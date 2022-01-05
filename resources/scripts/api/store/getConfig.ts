import http from '@/api/http';
import { ConfigResponse } from '@/components/store/servers/CreateServerContainer';

export default async (id: string): Promise<ConfigResponse> => {
    const { data } = await http.get(`/api/client/store/config/${id}`);
    return (data.data || []);
};
