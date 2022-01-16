import React from 'react';
import tw from 'twin.macro';
import { NavLink } from 'react-router-dom';
import { useStoreState } from '@/state/hooks';
import Button from '@/components/elements/Button';
import TitledGreyBox from '@/components/elements/TitledGreyBox';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowCircleRight, faInfoCircle, faLayerGroup } from '@fortawesome/free-solid-svg-icons';

const UserInformationRow = () => {
    const user = useStoreState(state => state.user.data);

    return (
        <div css={tw`md:flex`}>
            <TitledGreyBox
                title={'User Information'}
                icon={faInfoCircle}
                css={tw`flex-1`}
            >
                <div>Nice to see you, {user!.username}!</div>
                <div>You have {user!.crBalance} credits available.</div>
                {user!.crSlots === 0 &&
                    <>
                        <br/>
                        Notice: It seems like you&apos;re in need of a
                        server slot in order to to make a server. You
                        will not be able to deploy a new server without one.
                    </>
                }
            </TitledGreyBox>
            <TitledGreyBox
                title={'Create Server'}
                icon={faLayerGroup}
                css={tw`flex-1 lg:flex-none lg:w-1/3 mt-8 md:mt-0 md:ml-10`}
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
