import React from 'react';
import PageContentBlock from '@/components/elements/PageContentBlock';
import tw from 'twin.macro';
import UserInformationRow from '@/components/store/UserInformationRow';
import ResourceRow from '@/components/store/ResourceRow';
import ActionsRow from '@/components/store/ActionsRow';

const StoreContainer = () => {
    return (
        <PageContentBlock title={'Jexactyl Store'}>
            <h3 css={tw`mt-8 mb-2 text-2xl`}>Information</h3>
            <div>
                <UserInformationRow/>
            </div>
            <h3 css={tw`mt-8 mb-2 text-2xl`}>Resources</h3>
            <div css={tw`md:flex`}>
                <ResourceRow/>
            </div>
            <h3 css={tw`mt-8 mb-2 text-2xl`}>Actions</h3>
            <div css={tw`md:flex`}>
                <ActionsRow/>
            </div>
        </PageContentBlock>
    );
};

export default StoreContainer;
