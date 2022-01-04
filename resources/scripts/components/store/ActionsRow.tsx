import { faArrowCircleRight, faDollarSign, faLayerGroup } from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import tw from 'twin.macro';
import Button from '@/components/elements/Button';
import TitledGreyBox from '@/components/elements/TitledGreyBox';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NavLink } from 'react-router-dom';
import Field from '@/components/elements/Field';

const ActionsRow = () => {
    return (
        <>
            <TitledGreyBox
                title={'Purchase Resources'}
                icon={faDollarSign}
                css={tw`flex-1`}
            >
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
        </>
    );
};

export default ActionsRow;
