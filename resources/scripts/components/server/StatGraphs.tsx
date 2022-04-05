import React, { useCallback, useState } from 'react';
import Chart, { ChartConfiguration } from 'chart.js';
import { ServerContext } from '@/state/server';
import { bpsToHuman, bytesToBps } from '@/helpers';
import merge from 'deepmerge';
import TitledGreyBox from '@/components/elements/TitledGreyBox';
import { faNetworkWired } from '@fortawesome/free-solid-svg-icons';
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
            duration: 5000,
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
        labels: Array(30).fill(''),
        datasets: [
            {
                fill: true,
                data: Array(30).fill(0),
            },
        ],
    },
});

export default () => {
    const status = ServerContext.useStoreState(state => state.status.value);
    const [ network, setNetwork ] = useState<Chart>();

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

        if (network && network.data.datasets) {
            const data = network.data.datasets[0].data!;

            data.push(bytesToBps(stats.network.rx_bytes, stats.network.tx_bytes, true));
            data.shift();

            network.update({ lazy: true });
        }
    });

    return (
        <div css={tw`mt-4`}>
            <div css={tw`w-full`}>
                <TitledGreyBox title={'Network Usage'} icon={faNetworkWired} css={tw`mr-0`}>
                    {status !== 'offline' ?
                        <canvas
                            id={'network_chart'}
                            ref={networkRef}
                            aria-label={'Server Networking Graph'}
                            role={'img'}
                        />
                        :
                        <p css={tw`text-xs text-neutral-400 text-center p-3`}>
                            Server is offline.
                        </p>
                    }
                </TitledGreyBox>
            </div>
        </div>
    );
};
