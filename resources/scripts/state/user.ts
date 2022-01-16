import { Action, action, Thunk, thunk } from 'easy-peasy';
import updateAccountEmail from '@/api/account/updateAccountEmail';
import updateAccountUsername from '@/api/account/updateAccountUsername';

export interface UserData {
    uuid: string;
    username: string;
    email: string;
    language: string;
    rootAdmin: boolean;
    useTotp: boolean;
    avatarURL: string;
    crBalance: number;
    crSlots: number;
    crCpu: number;
    crRam: number;
    crStorage: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface UserStore {
    data?: UserData;
    setUserData: Action<UserStore, UserData>;
    updateUserData: Action<UserStore, Partial<UserData>>;
    updateUserEmail: Thunk<UserStore, { email: string; password: string }, any, UserStore, Promise<void>>;
    updateUsername: Thunk<UserStore, { username: string; password: string }, any, UserStore, Promise<void>>;
}

const user: UserStore = {
    data: undefined,
    setUserData: action((state, payload) => {
        state.data = payload;
    }),

    updateUserData: action((state, payload) => {
        // Limitation of Typescript, can't do much about that currently unfortunately.
        // @ts-ignore
        state.data = { ...state.data, ...payload };
    }),

    updateUserEmail: thunk(async (actions, payload) => {
        await updateAccountEmail(payload.email, payload.password);

        actions.updateUserData({ email: payload.email });
    }),

    updateUsername: thunk(async (actions, payload) => {
        await updateAccountUsername(payload.username, payload.password);

        actions.updateUserData({ username: payload.username });
    }),
};

export default user;
