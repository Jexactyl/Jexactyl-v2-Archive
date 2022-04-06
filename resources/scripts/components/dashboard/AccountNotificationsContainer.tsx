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

    return (
        <PageContentBlock title={'Notifications'}>
            <FlashMessageRender byKey={'account:notifications'}/>
            <TitledGreyBox title={'Notifications'}>
                {
                    notifications.length === 0 ?
                        <p css={tw`text-center text-sm`}>
                            {loading ? <Spinner size={'small'} centered/> : 'You do not have any notifications.'}
                        </p>
                        :
                        notifications.map((notification, index) => (
                            <GreyRowBox
                                key={notification.id}
                                css={[ tw`bg-neutral-600 flex items-center`, index > 0 && tw`mt-2` ]}
                            >
                                <p css={tw`text-sm ml-4 hidden md:block`}>
                                    <code css={tw`font-mono py-1 px-2 bg-neutral-900 rounded`}>
                                        {notification.id}
                                    </code>
                                </p>
                            </GreyRowBox>
                        ))
                }
            </TitledGreyBox>
        </PageContentBlock>
    );
};
