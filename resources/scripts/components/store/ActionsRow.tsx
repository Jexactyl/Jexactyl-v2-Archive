import { faArrowCircleRight, faDollarSign, faLayerGroup } from '@fortawesome/free-solid-svg-icons';
import React from 'react';
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

const ActionsRow = () => {
    const { addFlash, clearFlashes, clearAndAddHttpError } = useFlash();

    const submitSlots = () => {
        clearFlashes('account:store:slots');
        buySlots()
            .then(() => addFlash({
                type: 'success',
                key: 'account:store:slots',
                message: '1 server slot has been added to your account.',
            }))
            .catch(error => {
                clearAndAddHttpError(error);
            });
    };

    const submitCPU = () => {
        clearFlashes('account:store:cpu');
        buyCPU()
            .then(() => addFlash({
                type: 'success',
                key: 'account:store:cpu',
                message: '50% CPU has been added to your account.',
            }))
            .catch(error => {
                clearAndAddHttpError(error);
            });
    };

    const submitRAM = () => {
        clearFlashes('account:store:ram');
        buyRAM()
            .then(() => addFlash({
                type: 'success',
                key: 'account:store:ram',
                message: '1GB RAM has been added to your account.',
            }))
            .catch(error => {
                clearAndAddHttpError(error);
            });
    };

    const submitStorage = () => {
        clearFlashes('account:store:storage');
        buyStorage()
            .then(() => addFlash({
                type: 'success',
                key: 'account:store:storage',
                message: '1GB Storage has been added to your account.',
            }))
            .catch(error => {
                clearAndAddHttpError(error);
            });
    };

    return (
        <>
            <TitledGreyBox
                title={'Purchase Resources'}
                icon={faDollarSign}
                css={tw`flex-1`}
            >
                <Button onClick={() => submitSlots()} css={tw`flex-1`}>
                    1 Slot
                </Button>
                <Button onClick={() => submitCPU()} css={tw`flex-1`}>
                    50% CPU
                </Button>
                <Button onClick={() => submitRAM()} css={tw`flex-1`}>
                    1GB RAM
                </Button>
                <Button onClick={() => submitStorage()} css={tw`flex-1 lg:flex-none lg:w-1/4 mt-8 md:mt-0 md:ml-10`}>
                    1GB Storage
                </Button>
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
