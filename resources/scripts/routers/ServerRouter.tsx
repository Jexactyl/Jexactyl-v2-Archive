import TransferListener from '@/components/server/TransferListener';
import React, { useEffect, useState } from 'react';
import { NavLink, Route, RouteComponentProps, Switch } from 'react-router-dom';
import ServerConsole from '@/components/server/ServerConsole';
import TransitionRouter from '@/TransitionRouter';
import WebsocketHandler from '@/components/server/WebsocketHandler';
import { ServerContext } from '@/state/server';
import DatabasesContainer from '@/components/server/databases/DatabasesContainer';
import FileManagerContainer from '@/components/server/files/FileManagerContainer';
import { CSSTransition } from 'react-transition-group';
import FileEditContainer from '@/components/server/files/FileEditContainer';
import AuditLogsContainer from '@/components/server/auditlogs/AuditLogsContainer';
import SettingsContainer from '@/components/server/settings/SettingsContainer';
import ScheduleContainer from '@/components/server/schedules/ScheduleContainer';
import ScheduleEditContainer from '@/components/server/schedules/ScheduleEditContainer';
import UsersContainer from '@/components/server/users/UsersContainer';
import Can from '@/components/elements/Can';
import BackupContainer from '@/components/server/backups/BackupContainer';
import Spinner from '@/components/elements/Spinner';
import ScreenBlock, { NotFound, ServerError } from '@/components/elements/ScreenBlock';
import http, { httpErrorToHuman } from '@/api/http';
import { State, useStoreState } from 'easy-peasy';
import SubNavigation from '@/components/elements/SubNavigation';
import NetworkContainer from '@/components/server/network/NetworkContainer';
import Sidebar from '@/components/elements/Sidebar';
import InstallListener from '@/components/server/InstallListener';
import StartupContainer from '@/components/server/startup/StartupContainer';
import ErrorBoundary from '@/components/elements/ErrorBoundary';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faArchive,
    faClock,
    faCog,
    faDatabase,
    faExternalLinkAlt,
    faFolder,
    faLayerGroup,
    faLock,
    faPlay,
    faScroll,
    faSignOutAlt,
    faSitemap,
    faTerminal,
    faUser,
    faStore,
    faHome,
} from '@fortawesome/free-solid-svg-icons';
import RequireServerPermission from '@/hoc/RequireServerPermission';
import ServerInstallSvg from '@/assets/images/server_installing.svg';
import ServerRestoreSvg from '@/assets/images/server_restore.svg';
import ServerErrorSvg from '@/assets/images/server_error.svg';
import tw from 'twin.macro';
import { ApplicationStore } from '@/state';
import useWindowDimensions from '@/plugins/useWindowDimensions';
import ProgressBar from '@/components/elements/ProgressBar';

const ConflictStateRenderer = () => {
    const status = ServerContext.useStoreState(state => state.server.data?.status || null);
    const isTransferring = ServerContext.useStoreState(state => state.server.data?.isTransferring || false);

    return (
        status === 'installing' || status === 'install_failed' ?
            <ScreenBlock
                title={'Running Installer'}
                image={ServerInstallSvg}
                message={'Your server should be ready soon, please try again in a few minutes.'}
            />
            :
            status === 'suspended' ?
                <ScreenBlock
                    title={'Server Suspended'}
                    image={ServerErrorSvg}
                    message={'This server is suspended and cannot be accessed.'}
                />
                :
                <ScreenBlock
                    title={isTransferring ? 'Transferring' : 'Restoring from Backup'}
                    image={ServerRestoreSvg}
                    message={isTransferring ? 'Your server is being transfered to a new node, please check back later.' : 'Your server is currently being restored from a backup, please check back in a few minutes.'}
                />
    );
};

const ServerRouter = ({ match, location }: RouteComponentProps<{ id: string }>) => {
    const [ error, setError ] = useState('');
    const { width } = useWindowDimensions();

    const id = ServerContext.useStoreState(state => state.server.data?.id);
    const uuid = ServerContext.useStoreState(state => state.server.data?.uuid);
    const inConflictState = ServerContext.useStoreState(state => state.server.inConflictState);
    const serverId = ServerContext.useStoreState(state => state.server.data?.internalId);
    const getServer = ServerContext.useStoreActions(actions => actions.server.getServer);
    const clearServerState = ServerContext.useStoreActions(actions => actions.clearServerState);
    const avatarURL = useStoreState((state: State<ApplicationStore>) => state.user.data!.avatarURL);
    const rootAdmin = useStoreState(state => state.user.data!.rootAdmin);
    const name = useStoreState((state: State<ApplicationStore>) => state.settings.data!.name);
    const email = useStoreState((state: State<ApplicationStore>) => state.user.data!.email);
    const crBalance = useStoreState((state: State<ApplicationStore>) => state.user.data!.crBalance);
    const storeEnabled = useStoreState((state: State<ApplicationStore>) => state.settings.data!.store.enabled);

    const onTriggerLogout = () => {
        http.post('/auth/logout').finally(() => {
            // @ts-ignore
            window.location = '/';
        });
    };

    useEffect(() => () => {
        clearServerState();
    }, []);

    useEffect(() => {
        setError('');

        getServer(match.params.id)
            .catch(error => {
                console.error(error);
                setError(httpErrorToHuman(error));
            });

        return () => {
            clearServerState();
        };
    }, [ match.params.id ]);

    return (
        <React.Fragment key={'server-router'}>
            <div css={tw`flex flex-row`}>
                <Sidebar css={tw`flex-none`}>
                    <ProgressBar/>
                    <div css={tw`h-16 w-full flex flex-col items-center justify-center mt-1 mb-3 select-none cursor-pointer`}>
                        <h1 css={tw`text-2xl text-neutral-50 whitespace-nowrap font-medium`}><a href="/">{name}</a></h1>
                    </div>
                    <Sidebar.Wrapper>
                        {location.pathname.endsWith(`/server/${id}`) ?
                            <Sidebar.Section>Server - Console</Sidebar.Section>
                            : location.pathname.startsWith(`/server/${id}/files`) ?
                                <Sidebar.Section>Server - Files</Sidebar.Section>
                                : location.pathname.startsWith(`/server/${id}/auditlogs`) ?
                                    <Sidebar.Section>Server - Logs</Sidebar.Section>
                                    : location.pathname.startsWith(`/server/${id}/databases`) ?
                                        <Sidebar.Section>Server - Databases</Sidebar.Section>
                                        : location.pathname.startsWith(`/server/${id}/schedules`) ?
                                            <Sidebar.Section>Server - Tasks</Sidebar.Section>
                                            : location.pathname.startsWith(`/server/${id}/users`) ?
                                                <Sidebar.Section>Server - Subusers</Sidebar.Section>
                                                : location.pathname.startsWith(`/server/${id}/backups`) ?
                                                    <Sidebar.Section>Server - Backups</Sidebar.Section>
                                                    : location.pathname.startsWith(`/server/${id}/network`) ?
                                                        <Sidebar.Section>Server - Network</Sidebar.Section>
                                                        : location.pathname.startsWith(`/server/${id}/startup`) ?
                                                            <Sidebar.Section>Server - Startup</Sidebar.Section>
                                                            : location.pathname.startsWith(`/server/${id}/settings`) ?
                                                                <Sidebar.Section>Server - Settings</Sidebar.Section>
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
                <div css={tw`flex-shrink flex-grow w-full`}>
                    {(!uuid || !id) ?
                        error ?
                            <ServerError message={error}/>
                            :
                            <Spinner size={'large'} centered/>
                        :
                        <>
                            <CSSTransition timeout={150} classNames={'fade'} appear in>
                                <SubNavigation>
                                    <div>
                                        {width < 768 &&
                                          <NavLink to={'/'} exact>
                                              <FontAwesomeIcon icon={faHome}/>
                                          </NavLink>
                                        }
                                        <NavLink to={`${match.url}`} exact>
                                            <FontAwesomeIcon icon={faTerminal}/> Console
                                        </NavLink>
                                        <Can action={'file.*'}>
                                            <NavLink to={`${match.url}/files`}>
                                                <FontAwesomeIcon icon={faFolder}/> Files
                                            </NavLink>
                                        </Can>
                                        <Can action={'audit-logs.*'}>
                                            <NavLink to={`${match.url}/auditlogs`}>
                                                <FontAwesomeIcon icon={faScroll}/> Logs
                                            </NavLink>
                                        </Can>
                                        <Can action={'database.*'}>
                                            <NavLink to={`${match.url}/databases`}>
                                                <FontAwesomeIcon icon={faDatabase}/> Databases
                                            </NavLink>
                                        </Can>
                                        <Can action={'schedule.*'}>
                                            <NavLink to={`${match.url}/schedules`}>
                                                <FontAwesomeIcon icon={faClock}/> Tasks
                                            </NavLink>
                                        </Can>
                                        <Can action={'user.*'}>
                                            <NavLink to={`${match.url}/users`}>
                                                <FontAwesomeIcon icon={faUser}/> Users
                                            </NavLink>
                                        </Can>
                                        <Can action={'backup.*'}>
                                            <NavLink to={`${match.url}/backups`}>
                                                <FontAwesomeIcon icon={faArchive}/> Backups
                                            </NavLink>
                                        </Can>
                                        <Can action={'allocation.*'}>
                                            <NavLink to={`${match.url}/network`}>
                                                <FontAwesomeIcon icon={faSitemap}/> Network
                                            </NavLink>
                                        </Can>
                                        <Can action={'startup.*'}>
                                            <NavLink to={`${match.url}/startup`}>
                                                <FontAwesomeIcon icon={faPlay}/> Startup
                                            </NavLink>
                                        </Can>
                                        <Can action={[ 'settings.*', 'file.sftp' ]} matchAny>
                                            <NavLink to={`${match.url}/settings`}>
                                                <FontAwesomeIcon icon={faCog}/> Settings
                                            </NavLink>
                                        </Can>
                                        {rootAdmin &&
                                        <a href={'/admin/servers/view/' + serverId} rel="noreferrer" target={'_blank'}>
                                            <FontAwesomeIcon icon={faExternalLinkAlt}/> Admin
                                        </a>
                                        }
                                    </div>
                                </SubNavigation>
                            </CSSTransition>
                            <InstallListener/>
                            <TransferListener/>
                            <WebsocketHandler/>
                            {(inConflictState && (!rootAdmin || (rootAdmin && !location.pathname.endsWith(`/server/${id}`)))) ?
                                <ConflictStateRenderer/>
                                :
                                <ErrorBoundary>
                                    <TransitionRouter>
                                        <Switch location={location}>
                                            <Route path={`${match.path}`} component={ServerConsole} exact/>
                                            <Route path={`${match.path}/files`} exact>
                                                <RequireServerPermission permissions={'file.*'}>
                                                    <FileManagerContainer/>
                                                </RequireServerPermission>
                                            </Route>
                                            <Route path={`${match.path}/files/:action(edit|new)`} exact>
                                                <Spinner.Suspense>
                                                    <FileEditContainer/>
                                                </Spinner.Suspense>
                                            </Route>
                                            <Route path={`${match.path}/auditlogs`} exact>
                                                <RequireServerPermission permissions={'audit-logs.*'}>
                                                    <AuditLogsContainer/>
                                                </RequireServerPermission>
                                            </Route>
                                            <Route path={`${match.path}/databases`} exact>
                                                <RequireServerPermission permissions={'database.*'}>
                                                    <DatabasesContainer/>
                                                </RequireServerPermission>
                                            </Route>
                                            <Route path={`${match.path}/schedules`} exact>
                                                <RequireServerPermission permissions={'schedule.*'}>
                                                    <ScheduleContainer/>
                                                </RequireServerPermission>
                                            </Route>
                                            <Route path={`${match.path}/schedules/:id`} exact>
                                                <ScheduleEditContainer/>
                                            </Route>
                                            <Route path={`${match.path}/users`} exact>
                                                <RequireServerPermission permissions={'user.*'}>
                                                    <UsersContainer/>
                                                </RequireServerPermission>
                                            </Route>
                                            <Route path={`${match.path}/backups`} exact>
                                                <RequireServerPermission permissions={'backup.*'}>
                                                    <BackupContainer/>
                                                </RequireServerPermission>
                                            </Route>
                                            <Route path={`${match.path}/network`} exact>
                                                <RequireServerPermission permissions={'allocation.*'}>
                                                    <NetworkContainer/>
                                                </RequireServerPermission>
                                            </Route>
                                            <Route path={`${match.path}/startup`} component={StartupContainer} exact/>
                                            <Route path={`${match.path}/settings`} component={SettingsContainer} exact/>
                                            <Route path={'*'} component={NotFound}/>
                                        </Switch>
                                    </TransitionRouter>
                                </ErrorBoundary>
                            }
                        </>
                    }
                </div>
            </div>
        </React.Fragment>
    );
};

export default (props: RouteComponentProps<any>) => (
    <ServerContext.Provider>
        <ServerRouter {...props}/>
    </ServerContext.Provider>
);
