import React from 'react';
import ScreenBlock from '@/components/elements/ScreenBlock';
import PaymentErrorSvg from '@/assets/images/payment_error.svg';

const PaymentErrorContainer = () => {
    return (
        <ScreenBlock
            title={'Payment Failed'}
            image={PaymentErrorSvg}
            message={'There was an error while processing that transaction. To retry, please return to the store page and attempt to buy credits again.\n\nIf you think this is a problem with our systems, please contact an administrator.'}
            storeButton
        />
    );
};

export default PaymentErrorContainer;
