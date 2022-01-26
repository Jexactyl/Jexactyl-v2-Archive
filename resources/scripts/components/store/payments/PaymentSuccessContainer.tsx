import React from 'react';
import PaymentScreenBlock from '@/components/elements/PaymentScreenBlock';
import PaymentSuccessSvg from '@/assets/images/payment_success.svg';

const PaymentSuccessContainer = () => {
    return (
        <PaymentScreenBlock
            title={'Payment Success'}
            image={PaymentSuccessSvg}
            message={'Thanks for your order. We\'ve recieved your payment and credits have been added to your account!'}
        />
    );
};

export default PaymentSuccessContainer;
