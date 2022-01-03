import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import tw from 'twin.macro';
import TitledGreyBox from '@/components/elements/TitledGreyBox';
import { useStoreState } from '@/state/hooks';

const UserInformationRow = () => {
    const crBalance = useStoreState(state => state.user.data!.crBalance);

    return (
        <TitledGreyBox
            title={'User Information'}
            icon={faInfoCircle}
            css={tw`flex-1`}
        >
            <div>You have <h3 css={tw`text-2xl`}>{crBalance}</h3> credits available.</div>
        </TitledGreyBox>
    );
};

export default UserInformationRow;
