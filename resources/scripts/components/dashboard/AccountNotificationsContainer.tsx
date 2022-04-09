import React, { useEffect, useState } from 'react';
import PageContentBlock from '@/components/elements/PageContentBlock';
import TitledGreyBox from '../elements/TitledGreyBox';
import getNotifications, { Notification } from '@/api/account/getNotifications';
import { useStoreActions } from '@/state/hooks';
import { httpErrorToHuman } from '@/api/http';
import FlashMessageRender from '@/components/FlashMessageRender';
import { Actions } from 'easy-peasy';
import { ApplicationStore } from '@/state';
import tw from 'twin.macro';
import GreyRowBox from '@/components/elements/GreyRowBox';
import Spinner from '@/components/elements/Spinner';
import Button from '../elements/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import deleteNotifications from '@/api/account/deleteNotifications';

export default () => {
    const [ loading, setLoading ] = useState(true);
    const [ notifications, setNotifications ] = useState<Notification[]>([]);

    const { addError, clearFlashes } = useStoreActions((actions: Actions<ApplicationStore>) => actions.flashes);

    useEffect(() => {
        clearFlashes('account');
        getNotifications()
            .then(notifications => setNotifications(notifications))
            .then(() => setLoading(false))
            .catch(error => {
                console.error(error);
                addError({ key: 'account:notifications', message: httpErrorToHuman(error) });
            });
    }, []);

    const submit = () => {
        deleteNotifications().catch(error => addError({ key: 'account:notifications', message: httpErrorToHuman(error) }));
    };

    return (
        <PageContentBlock title={'Notifications'}>
            <FlashMessageRender byKey={'account:notifications'} css={tw`mb-2`}/>
            <TitledGreyBox title={'Notifications'}>
                {
                    notifications.length === 0 ?
                        <p css={tw`text-center text-sm`}>
                            {loading ? <Spinner size={'large'} centered/> : 'You do not have any notifications.'}
                        </p>
                        :
                        notifications.map((n, index) => (
                            <GreyRowBox
                                key={n.id}
                                css={[ tw`bg-neutral-850 flex items-center`, index > 0 && tw`mt-2` ]}
                            >
                                <p css={tw`text-sm ml-4 hidden md:block`}>
                                    <code css={tw`font-mono py-1 px-2 bg-neutral-900 rounded mr-2`}>
                                        ID: {n.id}
                                    </code>
                                    <code css={tw`font-mono py-1 px-2 bg-neutral-900 rounded mr-2`}>
                                        Action: {n.action}
                                    </code>
                                    <code css={tw`font-mono py-1 px-2 bg-neutral-900 rounded mr-2`}>
                                        User: {n.userId}
                                    </code>
                                    <code css={tw`font-mono py-1 px-2 bg-neutral-900 rounded mr-2`}>
                                        Timestamp: {n.created ?? 'Unavailable'}
                                    </code>
                                </p>
                            </GreyRowBox>
                        ))
                }
            </TitledGreyBox>
            <TitledGreyBox title={'Delete Notifications?'} css={tw`mt-4`}>
                <p css={tw`text-sm`}>Deleting your notifications will erase all of your history on this panel.
                Are you sure you want to continue?
                </p>
                <div css={tw`text-right`}>
                    <Button onClick={submit} type={'submit'}>
                        <FontAwesomeIcon icon={faTrash}/> Delete
                    </Button>
                </div>
            </TitledGreyBox>
        </PageContentBlock>
    );
};
