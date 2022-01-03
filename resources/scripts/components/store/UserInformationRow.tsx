import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import tw from 'twin.macro';
import TitledGreyBox from '@/components/elements/TitledGreyBox';

const UserInformationRow = () => {
    return (
        <TitledGreyBox
            title={'User Information'}
            icon={faInfoCircle}
            css={tw`flex-1`}
        >
            <h3 css={tw`text-2xl`}>Placeholder</h3>
        </TitledGreyBox>
    );
};

export default UserInformationRow;
