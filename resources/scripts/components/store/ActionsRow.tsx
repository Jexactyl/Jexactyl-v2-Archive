import tw from 'twin.macro';
import React, { useState } from 'react';
import useFlash from '@/plugins/useFlash';
import buyCPU from '@/api/store/buy/buyCPU';
import buyRAM from '@/api/store/buy/buyRAM';
import buySlots from '@/api/store/buy/buySlots';
import Button from '@/components/elements/Button';
import buyStorage from '@/api/store/buy/buyStorage';
import TitledGreyBox from '@/components/elements/TitledGreyBox';
import { faHdd, faLayerGroup, faMemory, faMicrochip } from '@fortawesome/free-solid-svg-icons';

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
                console.error(error);
                clearAndAddHttpError({ key: 'resources', error });
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
                console.error(error);
                clearAndAddHttpError({ key: 'resources', error });
                setSubmit(false);
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
                clearAndAddHttpError({ key: 'resources', error });
                setSubmit(false);
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
                clearAndAddHttpError({ key: 'resources', error });
                setSubmit(false);
            });
    };

    return (
        <div css={tw`md:flex`}>
            <TitledGreyBox
                title={'Purchase Server Slots'}
                icon={faLayerGroup}
                css={tw`flex-1 lg:flex-none lg:w-1/4 mt-10 md:mt-0 md:ml-12`}
            >
                <Button onClick={() => submitSlots()} disabled={isSubmit}>
                    1 Slot
                </Button>
            </TitledGreyBox>
            <TitledGreyBox
                title={'Purchase CPU'}
                icon={faMicrochip}
                css={tw`flex-1 lg:flex-none lg:w-1/4 mt-10 md:mt-0 md:ml-12`}
            >
                <Button onClick={() => submitCPU()} disabled={isSubmit}>
                    50% CPU
                </Button>
            </TitledGreyBox>
            <TitledGreyBox
                title={'Purchase RAM'}
                icon={faMemory}
                css={tw`flex-1 lg:flex-none lg:w-1/4 mt-10 md:mt-0 md:ml-12`}
            >
                <Button onClick={() => submitRAM()} disabled={isSubmit}>
                    1GB RAM
                </Button>
            </TitledGreyBox>
            <TitledGreyBox
                title={'Purchase Storage'}
                icon={faHdd}
                css={tw`flex-1 lg:flex-none lg:w-1/4 mt-10 md:mt-0 md:ml-12`}
            >
                <Button onClick={() => submitStorage()} disabled={isSubmit}>
                    1GB Storage
                </Button>
            </TitledGreyBox>
        </div>
    );
};

export default ActionsRow;
