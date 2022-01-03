import {
    faLayerGroup,
    faMicrochip,
    faMemory,
    faHdd,
} from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import tw from 'twin.macro';
import TitledGreyBox from '@/components/elements/TitledGreyBox';

const ResourceRow = () => {
    return (
        <>
            <div className={'storeResourceBox'}>
                <div className={'storeResourceCol'}>
                    <TitledGreyBox
                        title={'Server Slots Available'}
                        icon={faLayerGroup}
                    >
                        <h3 css={tw`text-2xl`}>-/-</h3>
                    </TitledGreyBox>
                </div>
            </div>
            <div className={'storeResourceBox'}>
                <div className={'storeResourceCol'}>
                    <TitledGreyBox
                        title={'CPU available'}
                        icon={faMicrochip}
                    >
                        <h3 css={tw`text-2xl`}>-/-</h3>
                    </TitledGreyBox>
                </div>
            </div>
            <div className={'storeResourceBox'}>
                <div className={'storeResourceCol'}>
                    <TitledGreyBox
                        title={'RAM available'}
                        icon={faMemory}
                    >
                        <h3 css={tw`text-2xl`}>-/-</h3>
                    </TitledGreyBox>
                </div>
            </div>
            <div className={'storeResourceBox'}>
                <div className={'storeResourceCol'}>
                    <TitledGreyBox
                        title={'Storage available'}
                        icon={faHdd}
                    >
                        <h3 css={tw`text-2xl`}>-/-</h3>
                    </TitledGreyBox>
                </div>
            </div>
        </>
    );
};

export default ResourceRow;
