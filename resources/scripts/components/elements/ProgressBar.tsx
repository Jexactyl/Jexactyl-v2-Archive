import React, { useEffect, useRef } from 'react';
import styled from 'styled-components/macro';
import { useStoreActions, useStoreState } from 'easy-peasy';
import { randomInt } from '@/helpers';
import tw from 'twin.macro';

const BarFill = styled.div`
    ${tw`h-full`};
    transition: 250ms ease-in-out;
`;

export default () => {
    const interval = useRef<number>(null);
    const timeout = useRef<number>(null);
    const progress = useStoreState(state => state.progress.progress);
    const continuous = useStoreState(state => state.progress.continuous);
    const setProgress = useStoreActions(actions => actions.progress.setProgress);

    useEffect(() => {
        return () => {
            timeout.current && clearTimeout(timeout.current);
            interval.current && clearInterval(interval.current);
        };
    }, []);

    useEffect(() => {
        if (progress === 100) {
            // @ts-ignore
            timeout.current = setTimeout(() => setProgress(undefined), 500);
        }
    }, [ progress ]);

    useEffect(() => {
        if (!continuous) {
            interval.current && clearInterval(interval.current);
            return;
        }

        if (!progress || progress === 0) {
            setProgress(randomInt(20, 30));
        }
    }, [ continuous ]);

    useEffect(() => {
        if (continuous) {
            interval.current && clearInterval(interval.current);
            if ((progress || 0) >= 90) {
                setProgress(90);
            } else {
                // @ts-ignore
                interval.current = setTimeout(() => setProgress(progress + randomInt(1, 5)), 500);
            }
        }
    }, [ progress, continuous ]);

    return (
        <div css={tw`w-full fixed`} style={{ height: '7px' }}>
            <BarFill
                key={'bar1'}
                css={'bg-rainbow-50'}
                style={{ height: '1px', width: progress === undefined ? '100%' : `${progress}%` }}
            />
            <BarFill
                key={'bar2'}
                css={'bg-rainbow-100'}
                style={{ height: '2px', width: progress === undefined ? '100%' : `${progress}%` }}
            />
            <BarFill
                key={'bar3'}
                css={'bg-rainbow-150'}
                style={{ height: '3px', width: progress === undefined ? '100%' : `${progress}%` }}
            />
            <BarFill
                key={'bar4'}
                css={'bg-rainbow-200'}
                style={{ height: '4px', width: progress === undefined ? '100%' : `${progress}%` }}
            />
            <BarFill
                key={'bar5'}
                css={'bg-rainbow-250'}
                style={{ height: '5px', width: progress === undefined ? '100%' : `${progress}%` }}
            />
            <BarFill
                key={'bar6'}
                css={'bg-rainbow-300'}
                style={{ height: '6px', width: progress === undefined ? '100%' : `${progress}%` }}
            />
            <BarFill
                key={'bar7'}
                css={'bg-rainbow-350'}
                style={{ height: '7px', width: progress === undefined ? '100%' : `${progress}%` }}
            />
        </div>
    );
};
