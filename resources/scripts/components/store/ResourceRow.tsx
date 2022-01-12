import {
    faLayerGroup,
    faMicrochip,
    faMemory,
    faHdd,
} from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import tw from 'twin.macro';
import TitledGreyBox from '@/components/elements/TitledGreyBox';
import { useStoreState } from '@/state/hooks';
import { megabytesToHuman } from '@/helpers';

const ResourceRow = () => {
    const user = useStoreState(state => state.user.data);

    return (
        <>
            <div className={'storeResourceBox'}>
                <div className={'storeResourceCol'}>
                    <TitledGreyBox
                        title={'Server Slots Available'}
                        icon={faLayerGroup}
                    >
                        <h3 css={tw`text-2xl`}>{user!.crSlots}</h3>
                    </TitledGreyBox>
                </div>
            </div>
            <div className={'storeResourceBox'}>
                <div className={'storeResourceCol'}>
                    <TitledGreyBox
                        title={'CPU available'}
                        icon={faMicrochip}
                    >
                        <h3 css={tw`text-2xl`}>{user!.crCpu}%</h3>
                    </TitledGreyBox>
                </div>
            </div>
            <div className={'storeResourceBox'}>
                <div className={'storeResourceCol'}>
                    <TitledGreyBox
                        title={'RAM available'}
                        icon={faMemory}
                    >
                        <h3 css={tw`text-2xl`}>{megabytesToHuman(user!.crRam)}</h3>
                    </TitledGreyBox>
                </div>
            </div>
            <div className={'storeResourceBox'}>
                <div className={'storeResourceCol'}>
                    <TitledGreyBox
                        title={'Storage available'}
                        icon={faHdd}
                    >
                        <h3 css={tw`text-2xl`}>{megabytesToHuman(user!.crStorage)}</h3>
                    </TitledGreyBox>
                </div>
            </div>
        </>
    );
};

export default ResourceRow;
