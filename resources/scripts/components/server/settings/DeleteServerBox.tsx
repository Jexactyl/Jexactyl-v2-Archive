import React, { useEffect, useState } from 'react';
import { ServerContext } from '@/state/server';
import TitledGreyBox from '@/components/elements/TitledGreyBox';
import ConfirmationModal from '@/components/elements/ConfirmationModal';
import { Actions, useStoreActions } from 'easy-peasy';
import { ApplicationStore } from '@/state';
import { httpErrorToHuman } from '@/api/http';
import tw from 'twin.macro';
import Button from '@/components/elements/Button';
import deleteServer from '@/api/server/deleteServer';

export default () => {
    const uuid = ServerContext.useStoreState(state => state.server.data!.uuid);
    const [ isSubmitting, setIsSubmitting ] = useState(false);
    const [ modalVisible, setModalVisible ] = useState(false);
    const { addFlash, clearFlashes } = useStoreActions((actions: Actions<ApplicationStore>) => actions.flashes);

    const reinstall = () => {
        clearFlashes('settings');
        setIsSubmitting(true);
        deleteServer(uuid)
            .then(() => {
                addFlash({
                    key: 'settings',
                    type: 'success',
                    message: 'Your server has been deleted.',
                });
            })
            .catch(error => {
                console.error(error);
                addFlash({ key: 'settings', type: 'error', message: httpErrorToHuman(error) });
            })
            .then(() => {
                setIsSubmitting(false);
                setModalVisible(false);
            });
    };

    useEffect(() => {
        clearFlashes();
    }, []);

    return (
        <TitledGreyBox title={'Delete Server'} css={tw`relative mt-4`}>
            <ConfirmationModal
                title={'Confirm server deletion'}
                buttonText={'Yes, delete server'}
                onConfirmed={reinstall}
                showSpinnerOverlay={isSubmitting}
                visible={modalVisible}
                onModalDismissed={() => setModalVisible(false)}
            >
                Your server will be stopped and then purged from our systems, with data being irrecoverable.
            </ConfirmationModal>
            <p css={tw`text-sm`}>
                This process will add the resources on your server back to your account, so you can re-deploy at any time.
                <strong css={tw`font-medium`}>
                    ALL FILES WILL BE DELETED. Please ensure you&apos;ve saved any progress or data before continuing.
                    We are not responsible for your data loss if you perform this action.
                </strong>
            </p>
            <div css={tw`mt-6 text-right`}>
                <Button
                    type={'button'}
                    color={'red'}
                    isSecondary
                    onClick={() => setModalVisible(true)}
                >
                    Delete Server
                </Button>
            </div>
        </TitledGreyBox>
    );
};
