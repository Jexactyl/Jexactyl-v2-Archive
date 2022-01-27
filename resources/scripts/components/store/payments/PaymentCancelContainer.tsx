import React from 'react';
import PaymentErrorSvg from '@/assets/images/payment_error.svg';
import tw from 'twin.macro';
import Button from '@/components/elements/Button';
import PageContentBlock from '@/components/elements/PageContentBlock';
import { NavLink } from 'react-router-dom';

const PaymentCancelContainer = () => {
    return (
        <PageContentBlock>
            <div css={tw`flex justify-center`}>
                <div css={tw`w-full sm:w-3/4 md:w-1/2 p-12 md:p-20 bg-neutral-100 rounded-lg shadow-lg text-center relative`}>
                    <img src={PaymentErrorSvg} css={tw`w-1/2 h-auto select-none mx-auto`}/>
                    <h2 css={tw`mt-10 text-neutral-900 font-bold text-4xl`}>Payment Cancelled</h2>
                    <p css={tw`text-sm text-neutral-700 mt-2`}>
                        There was an error while processing that transaction.
                        To retry, please return to the store page and attempt to buy credits again.
                        If you think this is a problem with our systems, please contact an administrator.
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

export default PaymentCancelContainer;
