import React from 'react';
import tw from 'twin.macro';
import { megabytesToHuman } from '@/helpers';
import { useStoreState } from '@/state/hooks';
import TitledGreyBox from '@/components/elements/TitledGreyBox';
import { faLayerGroup, faMicrochip, faMemory, faHdd } from '@fortawesome/free-solid-svg-icons';

const ResourceRow = () => {
    const user = useStoreState(state => state.user.data);

    return (
        <div css={tw`md:flex`}>
            <TitledGreyBox
                title={'Server Slots Available'}
                icon={faLayerGroup}
                css={tw`flex-1 lg:flex-none lg:w-1/4 mt-10 md:mt-0 md:ml-12`}
            >
                <h3 css={tw`text-2xl`}>{user!.crSlots}</h3>
            </TitledGreyBox>
            <TitledGreyBox
                title={'CPU available'}
                icon={faMicrochip}
                css={tw`flex-1 lg:flex-none lg:w-1/4 mt-10 md:mt-0 md:ml-12`}
            >
                <h3 css={tw`text-2xl`}>{user!.crCpu}%</h3>
            </TitledGreyBox>
            <TitledGreyBox
                title={'RAM available'}
                icon={faMemory}
                css={tw`flex-1 lg:flex-none lg:w-1/4 mt-10 md:mt-0 md:ml-12`}
            >
                <h3 css={tw`text-2xl`}>{megabytesToHuman(user!.crRam)}</h3>
            </TitledGreyBox>
            <TitledGreyBox
                title={'Storage available'}
                icon={faHdd}
                css={tw`flex-1 lg:flex-none lg:w-1/4 mt-10 md:mt-0 md:ml-12`}
            >
                <h3 css={tw`text-2xl`}>{megabytesToHuman(user!.crStorage)}</h3>
            </TitledGreyBox>
        </div>
    );
};

export default ResourceRow;
