import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import LoginContainer from '@/components/auth/LoginContainer';
import LoginCheckpointContainer from '@/components/auth/LoginCheckpointContainer';
import LoginKeyCheckpointContainer from '@/components/auth/LoginKeyCheckpointContainer';
import ForgotPasswordContainer from '@/components/auth/ForgotPasswordContainer';
import ResetPasswordContainer from '@/components/auth/ResetPasswordContainer';
import RegisterContainer from '@/components/auth/RegisterContainer';
import { NotFound } from '@/components/elements/ScreenBlock';
import { useHistory, useLocation } from 'react-router';
import { useStoreState } from '@/state/hooks';

export default () => {
    const history = useHistory();
    const location = useLocation();
    const { path } = useRouteMatch();

    const userRegistration = useStoreState(state => state.settings.data!.userRegistration);

    return (
        <div className={'pt-8 xl:pt-32'}>
            <Switch location={location}>
                {userRegistration === '1' &&
                    <Route path={`${path}/register`} component={RegisterContainer} exact />
                }
                <Route path={`${path}/login`} component={LoginContainer} exact />
                <Route path={`${path}/login/checkpoint`} component={LoginCheckpointContainer} />
                <Route path={`${path}/login/key`} component={LoginKeyCheckpointContainer} />
                <Route path={`${path}/password`} component={ForgotPasswordContainer} exact />
                <Route path={`${path}/password/reset/:token`} component={ResetPasswordContainer} />
                <Route path={`${path}/checkpoint`} />
                <Route path={'*'}>
                    <NotFound onBack={() => history.push('/auth/login')}/>
                </Route>
            </Switch>
        </div>
    );
};
