import React from 'react';
import PaymentSuccessSvg from '@/assets/images/payment_success.svg';
import Button from '@/components/elements/Button';
import PageContentBlock from '@/components/elements/PageContentBlock';
import { NavLink } from 'react-router-dom';
import tw from 'twin.macro';

const PaymentSuccessContainer = () => {
    return (
        <PageContentBlock>
            <div css={tw`flex justify-center`}>
                <div css={tw`w-full sm:w-3/4 md:w-1/2 p-12 md:p-20 bg-neutral-100 rounded-lg shadow-lg text-center relative`}>
                    <img src={PaymentSuccessSvg} css={tw`w-1/2 h-auto select-none mx-auto`}/>
                    <h2 css={tw`mt-10 text-neutral-900 font-bold text-4xl`}>Payment Success!</h2>
                    <p css={tw`text-sm text-neutral-700 mt-2`}>
                        Thanks for your order.
                        We&apos;ve recieved your payment and credits have been added to your account!
                    </p>
                    <br/>
                    <NavLink to={'/store'} css={tw`mt-auto mb-3`}>
                        <Button type={'button'}>
                            Back to store
                        </Button>
                    </NavLink>
                </div>
            </div>
        </PageContentBlock>
    );
};

export default PaymentSuccessContainer;
