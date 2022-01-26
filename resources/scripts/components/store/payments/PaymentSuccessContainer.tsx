import React from 'react';
import ScreenBlock from '@/components/elements/ScreenBlock';
import PaymentSuccessSvg from '@/assets/images/payment_success.svg';

const PaymentSuccessContainer = () => {
    return (
        <ScreenBlock
            title={'Payment Success'}
            image={PaymentSuccessSvg}
            message={'Thanks for your order. We\'ve recieved your payment and credits have been added to your account!'}
            storeButton
        />
    );
};

export default PaymentSuccessContainer;
