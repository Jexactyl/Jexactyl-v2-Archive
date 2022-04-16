import React from 'react';
import tw from 'twin.macro';
import ActionsRow from '@/components/store/ActionsRow';
import ResourceRow from '@/components/store/ResourceRow';
import FlashMessageRender from '@/components/FlashMessageRender';
import PageContentBlock from '@/components/elements/PageContentBlock';
import UserInformationRow from '@/components/store/UserInformationRow';

const StoreContainer = () => {
    return (
        <PageContentBlock title={'Jexactyl Store'}>
            <div css={tw`w-full`}>
                <FlashMessageRender byKey={'resources'} css={tw`mb-4`} />
            </div>
            <h3 css={tw`mb-4 flex justify-center items-center text-3xl`}>Information</h3>
            <UserInformationRow/>
            <h3 css={tw`mt-8 flex justify-center items-center text-3xl`}>Resources</h3>
            <ResourceRow/>
            <h3 css={tw`mt-8 flex justify-center items-center text-3xl`}>Actions</h3>
            <ActionsRow/>
        </PageContentBlock>
    );
};

export default StoreContainer;
