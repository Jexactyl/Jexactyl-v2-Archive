import React from 'react';
import { Route, RouteComponentProps, Switch } from 'react-router-dom';
import TransitionRouter from '@/TransitionRouter';
import LoginContainer from '@/components/auth/LoginContainer';
import LoginCheckpointContainer from '@/components/auth/LoginCheckpointContainer';
import LoginKeyCheckpointContainer from '@/components/auth/LoginKeyCheckpointContainer';
import ForgotPasswordContainer from '@/components/auth/ForgotPasswordContainer';
import ResetPasswordContainer from '@/components/auth/ResetPasswordContainer';
import RegisterContainer from '@/components/auth/RegisterContainer';
import { NotFound } from '@/components/elements/ScreenBlock';
import { useStoreState } from 'easy-peasy';
import Particles from 'react-tsparticles';

export default ({ location, history, match }: RouteComponentProps) => {
    const userRegistration = useStoreState(state => state.settings.data!.userRegistration);

    return (
        <div>
            <Particles
                params={{
                    particles: {
                        number: {
                            value: 80,
                            density: {
                                enable: true,
                                value_area: 800,
                            },
                        },
                        color: {
                            value: '#ffffff',
                        },
                        shape: {
                            type: 'circle',
                            stroke: {
                                width: 0,
                                color: '#000000',
                            },
                            polygon: {
                                nb_sides: 5,
                            },
                            image: {
                                src: 'img/github.svg',
                                width: 100,
                                height: 100,
                            },
                        },
                        opacity: {
                            value: 0.40246529723245905,
                            random: false,
                            anim: {
                                enable: false,
                                speed: 1,
                                opacity_min: 0.1,
                                sync: false,
                            },
                        },
                        size: {
                            value: 1,
                            random: true,
                            anim: {
                                enable: false,
                                speed: 40,
                                size_min: 0.1,
                                sync: false,
                            },
                        },
                        line_linked: {
                            enable: true,
                            distance: 150,
                            color: '#ffffff',
                            opacity: 0.4,
                            width: 1,
                        },
                        move: {
                            enable: true,
                            speed: 5,
                            direction: 'none',
                            random: false,
                            straight: false,
                            out_mode: 'out',
                            bounce: false,
                            attract: {
                                enable: false,
                                rotateX: 600,
                                rotateY: 1200,
                            },
                        },
                    },
                    interactivity: {
                        detect_on: 'window',
                        events: {
                            onhover: {
                                enable: true,
                                mode: 'repulse',
                            },
                            onclick: {
                                enable: false,
                                mode: 'repulse',
                            },
                            resize: true,
                        },
                        modes: {
                            grab: {
                                distance: 400,
                                line_linked: {
                                    opacity: 1,
                                },
                            },
                            bubble: {
                                distance: 400,
                                size: 40,
                                duration: 2,
                                opacity: 8,
                            },
                            repulse: {
                                distance: 200,
                                duration: 0.4,
                            },
                            push: {
                                particles_nb: 4,
                            },
                            remove: {
                                particles_nb: 2,
                            },
                        },
                    },
                    retina_detect: true,
                }}
            />
            <div className={'pt-8 xl:pt-32'}>
                <TransitionRouter>
                    <Switch location={location}>
                        {userRegistration === '1' &&
                            <Route path={`${match.path}/register`} component={RegisterContainer} exact/>
                        }
                        <Route path={`${match.path}/login`} component={LoginContainer} exact/>
                        <Route path={`${match.path}/login/checkpoint`} component={LoginCheckpointContainer}/>
                        <Route path={`${match.path}/login/key`} component={LoginKeyCheckpointContainer}/>
                        <Route path={`${match.path}/password`} component={ForgotPasswordContainer} exact/>
                        <Route path={`${match.path}/password/reset/:token`} component={ResetPasswordContainer}/>
                        <Route path={`${match.path}/checkpoint`}/>
                        <Route path={'*'}>
                            <NotFound onBack={() => history.push('/auth/login')}/>
                        </Route>
                    </Switch>
                </TransitionRouter>
            </div>
        </div>
    );
};
