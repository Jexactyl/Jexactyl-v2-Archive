import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import React, { useEffect, useState } from 'react';
import tw from 'twin.macro';
import TitledGreyBox from '@/components/elements/TitledGreyBox';
import getCrBalance, { CrBalanceData } from '@/api/account/getCrBalance';
import { httpErrorToHuman } from '@/api/http';
import { ApplicationStore } from '@/state';
import { useStoreActions, Actions } from 'easy-peasy';
import { useStoreState } from '@/state/hooks';

const UserInformationRow = () => {
    const crBalance = useStoreState(state => state.user.data!.crBalance);
    const [ data, setData ] = useState<CrBalanceData>();
    const { addError, clearFlashes } = useStoreActions((actions: Actions<ApplicationStore>) => actions.flashes);

    useEffect(() => {
        clearFlashes('account');
        getCrBalance()
            .then(data => setData(data))
            .catch(error => {
                console.error(error);
                addError({ key: 'account', message: httpErrorToHuman(error) });
            });
    }, []);

    // Debug log to make sure API works!
    console.log(data);

    return (
        <TitledGreyBox
            title={'User Information'}
            icon={faInfoCircle}
            css={tw`flex-1`}
        >
            You have <h3 css={tw`text-2xl`}>API: {data?.cr_balance} State: {crBalance}</h3> credits available.
        </TitledGreyBox>
    );
};

export default UserInformationRow;
