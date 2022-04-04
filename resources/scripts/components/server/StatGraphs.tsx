import React, { useCallback, useState } from 'react';
import Chart, { ChartConfiguration } from 'chart.js';
import { ServerContext } from '@/state/server';
import { bpsToHuman, bytesToBps, bytesToMegabytes } from '@/helpers';
import merge from 'deepmerge';
import TitledGreyBox from '@/components/elements/TitledGreyBox';
import { faMemory, faMicrochip, faNetworkWired } from '@fortawesome/free-solid-svg-icons';
import tw from 'twin.macro';
import { SocketEvent } from '@/components/server/events';
import useWebsocketEvent from '@/plugins/useWebsocketEvent';

const chartDefaults = (ticks?: Chart.TickOptions | undefined): ChartConfiguration => ({
    type: 'line',
    options: {
        legend: {
            display: false,
        },
        tooltips: {
            enabled: false,
        },
        animation: {
            duration: 0,
        },
        elements: {
            point: {
                radius: 0,
            },
            line: {
                tension: 0.3,
                backgroundColor: 'rgba(15, 178, 184, 0.45)',
                borderColor: '#32D0D9',
            },
        },
        scales: {
            xAxes: [ {
                ticks: {
                    display: false,
                },
                gridLines: {
                    display: false,
                },
            } ],
            yAxes: [ {
                gridLines: {
                    drawTicks: false,
                    color: 'rgba(229, 232, 235, 0.15)',
                    zeroLineColor: 'rgba(15, 178, 184, 0.45)',
                    zeroLineWidth: 3,
                },
                ticks: merge(ticks || {}, {
                    fontSize: 10,
                    fontFamily: '"IBM Plex Mono", monospace',
                    fontColor: 'rgb(229, 232, 235)',
                    min: 0,
                    beginAtZero: true,
                    maxTicksLimit: 5,
                }),
            } ],
        },
    },
    data: {
        labels: Array(20).fill(''),
        datasets: [
            {
                fill: true,
                data: Array(20).fill(0),
            },
        ],
    },
});

export default () => {
    const status = ServerContext.useStoreState(state => state.status.value);
    const limits = ServerContext.useStoreState(state => state.server.data!.limits);

    const [ memory, setMemory ] = useState<Chart>();
    const [ cpu, setCpu ] = useState<Chart>();
    const [ network, setNetwork ] = useState<Chart>();

    const memoryRef = useCallback<(node: HTMLCanvasElement | null) => void>(node => {
        if (!node) {
            return;
        }

        setMemory(
            new Chart(node.getContext('2d')!, chartDefaults({
                callback: (value) => `${value}Mb  `,
                suggestedMax: limits.memory,
            })),
        );
    }, []);

    const cpuRef = useCallback<(node: HTMLCanvasElement | null) => void>(node => {
        if (!node) {
            return;
        }

        setCpu(
            new Chart(node.getContext('2d')!, chartDefaults({
                callback: (value) => `${value}%  `,
            })),
        );
    }, []);

    const networkRef = useCallback<(node: HTMLCanvasElement | null) => void>(node => {
        if (!node) {
            return;
        }

        setNetwork(
            new Chart(node.getContext('2d')!, chartDefaults({
                callback: (value) => `${bpsToHuman(value)}  `,
            })),
        );
    }, []);

    useWebsocketEvent(SocketEvent.STATS, (data: string) => {
        let stats: any = {};
        try {
            stats = JSON.parse(data);
        } catch (e) {
            return;
        }

        if (memory && memory.data.datasets) {
            const data = memory.data.datasets[0].data!;

            data.push(bytesToMegabytes(stats.memory_bytes));
            data.shift();

            memory.update({ lazy: true });
        }

        if (cpu && cpu.data.datasets) {
            const data = cpu.data.datasets[0].data!;

            data.push(stats.cpu_absolute);
            data.shift();

            cpu.update({ lazy: true });
        }

        if (network && network.data.datasets) {
            const data = network.data.datasets[0].data!;

            data.push(bytesToBps(stats.network.rx_bytes, stats.network.tx_bytes, true));
            data.shift();

            network.update({ lazy: true });
        }
    });

    return (
        <>
            <div css={tw`mt-4`}>
                <div css={tw`w-full`}>
                    <TitledGreyBox title={'Memory usage'} icon={faMemory} css={tw`mr-0`}>
                        {status !== 'offline' ?
                            <canvas
                                id={'memory_chart'}
                                ref={memoryRef}
                                aria-label={'Server Memory Usage Graph'}
                                role={'img'}
                            />
                            :
                            <p css={tw`text-xs text-neutral-400 text-center p-3`}>
                            Server is offline.
                            </p>
                        }
                    </TitledGreyBox>
                </div>
                <div css={tw`mt-4`}>
                    <div css={tw`w-full`}>
                        <TitledGreyBox title={'CPU usage'} icon={faMicrochip} css={tw`ml-0`}>
                            {status !== 'offline' ?
                                <canvas id={'cpu_chart'} ref={cpuRef} aria-label={'Server CPU Usage Graph'} role={'img'}/>
                                :
                                <p css={tw`text-xs text-neutral-400 text-center p-3`}>
                                Server is offline.
                                </p>
                            }
                        </TitledGreyBox>
                    </div>
                </div>
            </div>

            <div css={tw`mt-4`}>
                <div css={tw`w-full`}>
                    <TitledGreyBox title={'Network'} icon={faNetworkWired} css={tw`mr-0`}>
                        {status !== 'offline' ?
                            <canvas id={'network_chart'} ref={networkRef} aria-label={'Server Networking Graph'} role={'img'}/>
                            :
                            <p css={tw`text-xs text-neutral-400 text-center p-3`}>
                            Server is offline.
                            </p>
                        }
                    </TitledGreyBox>
                </div>
            </div>
        </>
    );
};
