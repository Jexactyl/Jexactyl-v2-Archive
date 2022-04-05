import { ServerContext } from '@/state/server';
import React, { useEffect, useState } from 'react';
import { SocketEvent, SocketRequest } from '@/components/server/events';
import TitledGreyBox from '@/components/elements/TitledGreyBox';
import styled from 'styled-components/macro';
import tw from 'twin.macro';

interface Stats {
    memory: number;
    cpu: number;
    disk: number;
}

const Bar = styled.div`
    ${tw`h-0.5 bg-cyan-400`};
    transition: 1000ms ease-in-out;
`;

const StatBars = () => {
    const [ stats, setStats ] = useState<Stats>({ memory: 0, cpu: 0, disk: 0 });

    const instance = ServerContext.useStoreState(state => state.socket.instance);
    const connected = ServerContext.useStoreState(state => state.socket.connected);
    const limits = ServerContext.useStoreState(state => state.server.data!.limits);

    const diskUsed = (stats.disk / 1024 / 1024) / limits.disk * 100;
    const ramUsed = (stats.memory / 1024 / 1024) / limits.memory * 100;

    const statsListener = (data: string) => {
        let stats: any = {};
        try {
            stats = JSON.parse(data);
        } catch (e) {
            return;
        }

        setStats({
            memory: stats.memory_bytes,
            cpu: stats.cpu_absolute,
            disk: stats.disk_bytes,
        });
    };

    useEffect(() => {
        if (!connected || !instance) {
            return;
        }

        instance.addListener(SocketEvent.STATS, statsListener);
        instance.send(SocketRequest.SEND_STATS);

        return () => {
            instance.removeListener(SocketEvent.STATS, statsListener);
        };
    }, [ instance, connected ]);

    return (
        <TitledGreyBox title={'Server Statistics'} css={tw`text-xs uppercase`}>
            Disk used
            <Bar style={{ width: diskUsed.toFixed(0) === undefined ? '100%' : `${diskUsed.toFixed(0)}%` }} css={tw`mb-2`}/>

            RAM used
            <Bar style={{ width: ramUsed.toFixed(0) === undefined ? '100%' : `${ramUsed.toFixed(0)}%` }} css={tw`mb-2`}/>

            CPU used
            <Bar style={{ width: stats.cpu.toFixed(0) === undefined ? '100%' : `${stats.cpu.toFixed(0)}%` }}/>
        </TitledGreyBox>
    );
};

export default StatBars;
