import { faArrowCircleRight, faDollarSign, faLayerGroup } from '@fortawesome/free-solid-svg-icons';
import React, { useState } from 'react';
import tw from 'twin.macro';
import Button from '@/components/elements/Button';
import TitledGreyBox from '@/components/elements/TitledGreyBox';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NavLink } from 'react-router-dom';
import buyCPU from '@/api/store/buy/buyCPU';
import useFlash from '@/plugins/useFlash';
import buySlots from '@/api/store/buy/buySlots';
import buyRAM from '@/api/store/buy/buyRAM';
import buyStorage from '@/api/store/buy/buyStorage';
import FlashMessageRender from '../FlashMessageRender';

const ActionsRow = () => {
    const { addFlash, clearFlashes, clearAndAddHttpError } = useFlash();
    const [ isSubmit, setSubmit ] = useState(false);

    const submitSlots = () => {
        clearFlashes('account:slots');
        setSubmit(true);

        buySlots()
            .then(() => setSubmit(false))
            .then(() => addFlash({
                type: 'success',
                key: 'account:slots',
                message: '1 server slot has been added to your account.',
            }))
            .catch(error => {
                clearAndAddHttpError(error);
                setSubmit(false);
            });
    };

    const submitCPU = () => {
        clearFlashes('account:cpu');
        setSubmit(true);

        buyCPU()
            .then(() => setSubmit(false))
            .then(() => addFlash({
                type: 'success',
                key: 'account:cpu',
                message: '50% CPU has been added to your account.',
            }))
            .catch(error => {
                clearAndAddHttpError(error);
            });
    };

    const submitRAM = () => {
        clearFlashes('account:ram');
        setSubmit(true);

        buyRAM()
            .then(() => setSubmit(false))
            .then(() => addFlash({
                type: 'success',
                key: 'account:ram',
                message: '1GB RAM has been added to your account.',
            }))
            .catch(error => {
                clearAndAddHttpError(error);
            });
    };

    const submitStorage = () => {
        clearFlashes('account:storage');
        setSubmit(true);

        buyStorage()
            .then(() => setSubmit(false))
            .then(() => addFlash({
                type: 'success',
                key: 'account:storage',
                message: '1GB Storage has been added to your account.',
            }))
            .catch(error => {
                clearAndAddHttpError(error);
            });
    };

    return (
        <>
            <div css={tw`w-full`}>
                <FlashMessageRender byKey={'account:store'} css={tw`mb-4`} />
            </div>
            <TitledGreyBox
                title={'Purchase Resources'}
                icon={faDollarSign}
                css={tw`flex-1`}
            >
                <div className={'butonBox'}>
                    <div className={'buttonCol'}>
                        <Button onClick={() => submitSlots()} disabled={isSubmit}>
                            1 Slot
                        </Button>
                    </div>
                </div>
                <div className={'butonBox'}>
                    <div className={'buttonCol'}>
                        <Button onClick={() => submitCPU()} disabled={isSubmit}>
                            50% CPU
                        </Button>
                    </div>
                </div>
                <div className={'butonBox'}>
                    <div className={'buttonCol'}>
                        <Button onClick={() => submitRAM()} disabled={isSubmit}>
                            1GB RAM
                        </Button>
                    </div>
                </div>
                <div className={'butonBox'}>
                    <div className={'buttonCol'}>
                        <Button onClick={() => submitStorage()} disabled={isSubmit}>
                            1GB Storage
                        </Button>
                    </div>
                </div>
            </TitledGreyBox>
            <TitledGreyBox
                title={'Create Server'}
                icon={faLayerGroup}
                css={tw`flex-1 lg:flex-none lg:w-1/3 mt-8 md:mt-0 md:ml-10`}
            >
                Create a server with a specific amount of RAM, CPU and storage
                allocated to it.
                <div css={tw`mt-8 flex justify-end`}>
                    <NavLink to={'/store/servers/new'}>
                        <Button type={'button'}>
                            Create server <FontAwesomeIcon icon={faArrowCircleRight}/>
                        </Button>
                    </NavLink>
                </div>
            </TitledGreyBox>
        </>
    );
};

export default ActionsRow;
