import { Model, UUID } from '@/api/definitions';
import { SubuserPermission } from '@/state/server/subusers';

interface User extends Model {
    uuid: string;
    username: string;
    email: string;
    image: string;
    twoFactorEnabled: boolean;
    createdAt: Date;
    permissions: SubuserPermission[];
    can (permission: SubuserPermission): boolean;
}

interface SSHKey extends Model {
    name: string;
    publicKey: string;
    fingerprint: string;
    createdAt: Date;
}

interface ActivityLog extends Model<'actor'> {
    batch: UUID | null;
    event: string;
    ip: string;
    description: string | null;
    properties: Record<string, string | unknown>;
    timestamp: Date;
    relationships: {
        actor: User | null;
    }
}
