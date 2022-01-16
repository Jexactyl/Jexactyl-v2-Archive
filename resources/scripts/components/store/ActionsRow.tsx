import { faHdd, faLayerGroup, faMemory, faMicrochip } from '@fortawesome/free-solid-svg-icons';
import React, { useState } from 'react';
import Button from '@/components/elements/Button';
import TitledGreyBox from '@/components/elements/TitledGreyBox';
import buyCPU from '@/api/store/buy/buyCPU';
import useFlash from '@/plugins/useFlash';
import buySlots from '@/api/store/buy/buySlots';
import buyRAM from '@/api/store/buy/buyRAM';
import buyStorage from '@/api/store/buy/buyStorage';
import tw from 'twin.macro';

const ActionsRow = () => {
    const { addFlash, clearFlashes, clearAndAddHttpError } = useFlash();
    const [ isSubmit, setSubmit ] = useState(false);

    const submitSlots = () => {
        clearFlashes('resources');
        setSubmit(true);

        buySlots()
            .then(() => setSubmit(false))
            .then(() => addFlash({
                type: 'success',
                key: 'resources',
                message: '1 server slot has been added to your account.',
            }))
            .catch(error => {
                clearAndAddHttpError({ error });
                setSubmit(false);
            });
    };

    const submitCPU = () => {
        clearFlashes('resources');
        setSubmit(true);

        buyCPU()
            .then(() => setSubmit(false))
            .then(() => addFlash({
                type: 'success',
                key: 'resources',
                message: '50% CPU has been added to your account.',
            }))
            .catch(error => {
                clearAndAddHttpError({ error });
            });
    };

    const submitRAM = () => {
        clearFlashes('resources');
        setSubmit(true);

        buyRAM()
            .then(() => setSubmit(false))
            .then(() => addFlash({
                type: 'success',
                key: 'resources',
                message: '1GB RAM has been added to your account.',
            }))
            .catch(error => {
                clearAndAddHttpError({ error });
            });
    };

    const submitStorage = () => {
        clearFlashes('resources');
        setSubmit(true);

        buyStorage()
            .then(() => setSubmit(false))
            .then(() => addFlash({
                type: 'success',
                key: 'resources',
                message: '1GB Storage has been added to your account.',
            }))
            .catch(error => {
                clearAndAddHttpError({ error });
            });
    };

    return (
        <div css={tw`md:flex`}>
            <TitledGreyBox
                title={'Purchase Server Slots'}
                icon={faLayerGroup}
                css={tw`flex-1`}
            >
                <Button onClick={() => submitSlots()} disabled={isSubmit}>
                    1 Slot
                </Button>
            </TitledGreyBox>
            <TitledGreyBox
                title={'Purchase CPU'}
                icon={faMicrochip}
                css={tw`flex-1 lg:flex-none lg:w-1/4 mt-4 md:mt-0 md:ml-5`}
            >
                <Button onClick={() => submitCPU()} disabled={isSubmit}>
                    50% CPU
                </Button>
            </TitledGreyBox>
            <TitledGreyBox
                title={'Purchase RAM'}
                icon={faMemory}
                css={tw`flex-1 lg:flex-none lg:w-1/4 mt-4 md:mt-0 md:ml-5`}
            >
                <Button onClick={() => submitRAM()} disabled={isSubmit}>
                    1GB RAM
                </Button>
            </TitledGreyBox>
            <TitledGreyBox
                title={'Purchase Storage'}
                icon={faHdd}
                css={tw`flex-1 lg:flex-none lg:w-1/4 mt-4 md:mt-0 md:ml-5`}
            >
                <Button onClick={() => submitStorage()} disabled={isSubmit}>
                    1GB Storage
                </Button>
            </TitledGreyBox>
        </div>
    );
};

export default ActionsRow;
