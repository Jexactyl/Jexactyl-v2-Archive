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
            <h3 css={tw`mt-8 mb-2 text-2xl`}>Information</h3>
            <div>
                <UserInformationRow/>
            </div>
            <h3 css={tw`mt-8 mb-2 text-2xl px-10`}>Resources</h3>
            <div css={tw`md:flex`}>
                <ResourceRow/>
            </div>
            <h3 css={tw`mt-8 mb-2 text-2xl px-10`}>Actions</h3>
            <div css={tw`md:flex`}>
                <ActionsRow/>
            </div>
        </PageContentBlock>
    );
};

export default StoreContainer;
