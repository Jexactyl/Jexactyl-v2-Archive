import React from 'react';
import { NavLink, Route, RouteComponentProps, Switch } from 'react-router-dom';
import AccountOverviewContainer from '@/components/dashboard/AccountOverviewContainer';
import DashboardContainer from '@/components/dashboard/DashboardContainer';
import AccountApiContainer from '@/components/dashboard/AccountApiContainer';
import SecurityKeyContainer from '@/components/dashboard/SecurityKeyContainer';
import { NotFound } from '@/components/elements/ScreenBlock';
import TransitionRouter from '@/TransitionRouter';
import tw from 'twin.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLayerGroup, faLock, faSignOutAlt, faSitemap, faUser, faCog, faStore } from '@fortawesome/free-solid-svg-icons';
import Sidebar from '@/components/elements/Sidebar';
import { useStoreState } from '@/state/hooks';
import { ApplicationStore } from '@/state';
import { CSSTransition } from 'react-transition-group';
import { State } from 'easy-peasy';
import http from '@/api/http';
import useWindowDimensions from '@/plugins/useWindowDimensions';
import StaticSubNavigation from '@/components/elements/StaticSubNavigation';
import Spinner from '@/components/elements/Spinner';
import ProgressBar from '@/components/elements/ProgressBar';

const DashboardRouter = ({ location }: RouteComponentProps) => {
    const { width } = useWindowDimensions();

    const avatarURL = useStoreState((state: State<ApplicationStore>) => state.user.data!.avatarURL);
    const name = useStoreState((state: State<ApplicationStore>) => state.settings.data!.name);
    const email = useStoreState((state: State<ApplicationStore>) => state.user.data!.email);
    const crBalance = useStoreState((state: State<ApplicationStore>) => state.user.data!.crBalance);
    const rootAdmin = useStoreState((state: State<ApplicationStore>) => state.user.data!.rootAdmin);
    const storeEnabled = useStoreState((state: State<ApplicationStore>) => state.settings.data!.store.enabled);

    const onTriggerLogout = () => {
        http.post('/auth/logout').finally(() => {
            // @ts-ignore
            window.location = '/';
        });
    };

    return (
        <div css={tw`flex flex-row`}>
            <Sidebar>
                <ProgressBar/>
                <div css={tw`h-16 w-full flex flex-col items-center justify-center mt-1 mb-3 select-none cursor-pointer`}>
                    <h1 css={tw`text-2xl text-neutral-50 whitespace-nowrap font-medium`}><a href="/">{name}</a></h1>
                </div>
                <Sidebar.Wrapper>
                    {location.pathname.endsWith('/') ?
                        <Sidebar.Section>Dashboard - Servers</Sidebar.Section>
                        : location.pathname.endsWith('/account') ?
                            <Sidebar.Section>Dashboard - Account</Sidebar.Section>
                            : location.pathname.endsWith('/account/api') ?
                                <Sidebar.Section>Dashboard - API</Sidebar.Section>
                                : location.pathname.endsWith('/account/security') ?
                                    <Sidebar.Section>Dashboard - Security</Sidebar.Section>
                                    :
                                    <Spinner size={'small'} centered isBlue/>
                    }
                    <NavLink to={'/'} exact>
                        <FontAwesomeIcon icon={faLayerGroup}/><span>Servers</span>
                    </NavLink>
                    <NavLink to={'/account'} exact>
                        <FontAwesomeIcon icon={faUser}/><span>Account</span>
                    </NavLink>
                    <NavLink to={'/account/api'} exact>
                        <FontAwesomeIcon icon={faSitemap}/><span>API</span>
                    </NavLink>
                    <NavLink to={'/account/security'} exact>
                        <FontAwesomeIcon icon={faLock}/><span>Security</span>
                    </NavLink>
                    {storeEnabled === '1' &&
                        <NavLink to={'/store'} exact>
                            <FontAwesomeIcon icon={faStore}/><span>Store</span>
                        </NavLink>
                    }
                    {rootAdmin &&
                        <a href={'/admin'}>
                            <FontAwesomeIcon icon={faCog}/> <span>Admin</span>
                        </a>
                    }
                </Sidebar.Wrapper>
                <NavLink to={'/'} onClick={onTriggerLogout} css={tw`mt-auto mb-3`}>
                    <FontAwesomeIcon icon={faSignOutAlt}/> <span>Logout</span>
                </NavLink>
                <Sidebar.User>
                    {avatarURL &&
                      <img src={`${avatarURL}?s=64`} alt="Profile Picture" css={tw`h-10 w-10 rounded-full select-none`}/>
                    }
                    <div css={tw`flex flex-col ml-3`}>
                        <span css={tw`font-sans font-normal text-sm text-neutral-50 whitespace-nowrap leading-tight select-none`}>{email}</span>
                        <span css={tw`font-header font-normal text-xs text-neutral-300 whitespace-nowrap leading-tight select-none`}>{crBalance} credits</span>
                    </div>
                </Sidebar.User>
            </Sidebar>
            <div css={tw`flex-shrink flex-grow`}>
                {width < 768 &&
                    <CSSTransition timeout={150} classNames={'fade'} appear in>
                        <StaticSubNavigation>
                            <div>
                                <NavLink to={'/'}>
                                    <FontAwesomeIcon icon={faLayerGroup}/>
                                </NavLink>
                                <NavLink to={'/account'}>
                                    <FontAwesomeIcon icon={faUser}/>
                                </NavLink>
                                <NavLink to={'/account/api'}>
                                    <FontAwesomeIcon icon={faSitemap}/>
                                </NavLink>
                                <NavLink to={'/account/security'}>
                                    <FontAwesomeIcon icon={faLock}/>
                                </NavLink>
                                {storeEnabled &&
                                  <NavLink to={'/store'}>
                                      <FontAwesomeIcon icon={faStore}/>
                                  </NavLink>
                                }
                                {rootAdmin &&
                                <a href={'/admin'}>
                                    <FontAwesomeIcon icon={faCog}/>
                                </a>
                                }
                                <NavLink to={'/'} onClick={onTriggerLogout}>
                                    <FontAwesomeIcon icon={faSignOutAlt}/>
                                </NavLink>
                            </div>
                        </StaticSubNavigation>
                    </CSSTransition>
                }
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
                        <Route path={'/account/security'} exact>
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

export default DashboardRouter;
