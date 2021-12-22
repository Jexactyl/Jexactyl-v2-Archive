import React from 'react';
import { Route, RouteComponentProps, Switch } from 'react-router-dom';
import AccountOverviewContainer from '@/components/dashboard/AccountOverviewContainer';
import DashboardContainer from '@/components/dashboard/DashboardContainer';
import AccountApiContainer from '@/components/dashboard/AccountApiContainer';
import SecurityKeyContainer from '@/components/dashboard/SecurityKeyContainer';
import { NotFound } from '@/components/elements/ScreenBlock';
import TransitionRouter from '@/TransitionRouter';
import SidePanel, { Category } from '@/components/SidePanel';
import tw from 'twin.macro';
import DashboardSwitch from '@/components/elements/DashboardSwitch';
import { usePersistedState } from '@/plugins/usePersistedState';
import { ServerContext } from '@/state/server';

const DashboardRouter = ({ location }: RouteComponentProps) => {
    const uuid = ServerContext.useStoreState(state => state.server.data?.uuid);
    const [ showOnlyAdmin, setShowOnlyAdmin ] = usePersistedState(`${uuid}:show_all_servers`, false);

    return (
        <div css={tw`flex flex-row`}>
            {location.pathname.endsWith('/') ?
                <SidePanel>
                    <Category>
                        <DashboardSwitch
                            name={'show_all_servers'}
                            defaultChecked={showOnlyAdmin}
                            onChange={() => setShowOnlyAdmin(s => !s)}
                        />
                    </Category>
                </SidePanel>
                :
                <SidePanel />
            }
            <div css={tw`flex-grow flex-shrink pl-32`}>
                <TransitionRouter>
                    <Switch location={location}>
                        <Route path={'/'} exact>
                            <DashboardContainer/>
                        </Route>
                        <Route path={'/account'} exact>
                            <AccountOverviewContainer/>
                        </Route>
                        <Route path={'/account/api'} exact>
                            <AccountApiContainer/>
                        </Route>
                        <Route path={'/account/keys/security'} exact>
                            <SecurityKeyContainer/>
                        </Route>
                        <Route path={'*'}>
                            <NotFound/>
                        </Route>
                    </Switch>
                </TransitionRouter>
            </div>
        </div>
    );
};

export default (props: RouteComponentProps<any>) => (
    <DashboardRouter {...props}/>
);
