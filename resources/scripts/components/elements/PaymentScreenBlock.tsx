import React from 'react';
import PageContentBlock from '@/components/elements/PageContentBlock';
import tw from 'twin.macro';
import { NavLink } from 'react-router-dom';
import Button from '@/components/elements/Button';

interface BaseProps {
    title: string;
    image: string;
    message: string;
}

const PaymentScreenBlock = ({ title, image, message }: BaseProps) => (
    <PageContentBlock>
        <div css={tw`flex justify-center`}>
            <div css={tw`w-full sm:w-3/4 md:w-1/2 p-12 md:p-20 bg-neutral-100 rounded-lg shadow-lg text-center relative`}>
                <img src={image} css={tw`w-2/3 h-auto select-none mx-auto`}/>
                <h2 css={tw`mt-10 text-neutral-900 font-bold text-4xl`}>{title}</h2>
                <p css={tw`text-sm text-neutral-700 mt-2`}>
                    {message}
                </p>
                <NavLink to={'/store'} css={tw`mt-auto mb-3`}>
                    <Button type={'button'}>
                        Back to store
                    </Button>
                </NavLink>
            </div>
        </div>
    </PageContentBlock>
);

export default PaymentScreenBlock;
