import { faHdd, faLayerGroup, faMemory, faMicrochip } from '@fortawesome/free-solid-svg-icons';
import React, { useState } from 'react';
import Button from '@/components/elements/Button';
import TitledGreyBox from '@/components/elements/TitledGreyBox';
import buyCPU from '@/api/store/buy/buyCPU';
import useFlash from '@/plugins/useFlash';
import buySlots from '@/api/store/buy/buySlots';
import buyRAM from '@/api/store/buy/buyRAM';
import buyStorage from '@/api/store/buy/buyStorage';

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
        <>
            <div className={'storePurchaseBox'}>
                <div className={'storePurchaseCol'}>
                    <TitledGreyBox title={'Purchase Server Slots'} icon={faLayerGroup}>
                        <Button onClick={() => submitSlots()} disabled={isSubmit}>
                                1 Slot
                        </Button>
                    </TitledGreyBox>
                </div>
            </div>
            <div className={'storePurchaseBox'}>
                <div className={'storePurchaseCol'}>
                    <TitledGreyBox title={'Purchase CPU'} icon={faMicrochip}>
                        <Button onClick={() => submitCPU()} disabled={isSubmit}>
                                50% CPU
                        </Button>
                    </TitledGreyBox>
                </div>
            </div>
            <div className={'storePurchaseBox'}>
                <div className={'storePurchaseCol'}>
                    <TitledGreyBox title={'Purchase RAM'} icon={faMemory}>
                        <Button onClick={() => submitRAM()} disabled={isSubmit}>
                                1GB RAM
                        </Button>
                    </TitledGreyBox>
                </div>
            </div>
            <div className={'storePurchaseBox'}>
                <div className={'storePurchaseCol'}>
                    <TitledGreyBox title={'Purchase Storage'} icon={faHdd}>
                        <Button onClick={() => submitStorage()} disabled={isSubmit}>
                                1GB Storage
                        </Button>
                    </TitledGreyBox>
                </div>
            </div>
        </>
    );
};

export default ActionsRow;
