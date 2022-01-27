import React, { useState } from 'react';
import tw from 'twin.macro';
import { NavLink } from 'react-router-dom';
import { useStoreState } from '@/state/hooks';
import Button from '@/components/elements/Button';
import TitledGreyBox from '@/components/elements/TitledGreyBox';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowCircleRight, faInfoCircle, faLayerGroup } from '@fortawesome/free-solid-svg-icons';
import Select from '@/components/elements/Select';
import buyCredits from '@/api/store/buy/buyCredits';
import useFlash from '@/plugins/useFlash';

const UserInformationRow = () => {
    const { clearAndAddHttpError } = useFlash();
    const [ isSubmit, setSubmit ] = useState(false);
    const user = useStoreState(state => state.user.data);

    const submitCredits = () => {
        setSubmit(true);

        buyCredits()
            .then(() => setSubmit(false))
            .catch(error => {
                console.error(error);
                clearAndAddHttpError({ key: 'resources', error });
                setSubmit(false);
            });
    };

    return (
        <div css={tw`grid gap-8 md:grid-cols-2`}>
            <TitledGreyBox
                title={'User Information'}
                icon={faInfoCircle}
            >
                <div>Nice to see you, {user!.username}!</div>
                <div>You have {user!.crBalance} credits available.</div>
                <br/>
                <Select
                    onChange={() => submitCredits()}
                    name={'Purchase Credits'}
                    disabled={isSubmit}
                >
                    <option key={'credits:100'} value={100}>Purchase 100 credits</option>
                    <option key={'credits:100'} value={200}>Purchase 200 credits</option>
                </Select>
            </TitledGreyBox>
            <TitledGreyBox
                title={'Create Server'}
                icon={faLayerGroup}
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
        </div>
    );
};

export default UserInformationRow;
