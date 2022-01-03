import React from 'react';
import { Route, RouteComponentProps, Switch } from 'react-router-dom';
import TransitionRouter from '@/TransitionRouter';
import SidePanel from '@/components/SidePanel';
import tw from 'twin.macro';
import StoreContainer from '@/components/store/StoreContainer';

export default ({ location, match }: RouteComponentProps) => (
    <div css={tw`flex flex-row`}>
        <SidePanel />
        <div css={tw`flex-grow flex-shrink pl-32`}>
            <TransitionRouter>
                <Switch location={location}>
                    <Route path={`${match.path}`} component={StoreContainer} exact/>
                </Switch>
            </TransitionRouter>
        </div>
    </div>
);
