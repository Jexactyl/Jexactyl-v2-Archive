import React, { forwardRef } from 'react';
import { Form } from 'formik';
import styled from 'styled-components/macro';
import { breakpoint } from '@/theme';
import FlashMessageRender from '@/components/FlashMessageRender';
import tw from 'twin.macro';
import Particles from 'react-tsparticles';
import { useStoreState } from 'easy-peasy';

const Wrapper = styled.div`
    ${breakpoint('sm')`
        ${tw`w-4/5 mx-auto`}
    `};
    ${breakpoint('md')`
        ${tw`p-10`}
    `};
    ${breakpoint('lg')`
        ${tw`w-3/5`}
    `};
    ${breakpoint('xl')`
        ${tw`w-full`}
        max-width: 700px;
    `};
`;

const Inner = ({ children }: { children: React.ReactNode }) => (
    <div css={tw`md:flex w-full bg-neutral-900 shadow-lg rounded-lg p-6 md:pl-0 mx-1`}>
        <div css={tw`flex-none select-none mb-6 md:mb-0 self-center`}>
            <img src={'/assets/svgs/pterodactyl.svg'} css={tw`block w-48 md:w-64 mx-auto`}/>
        </div>
        <div css={tw`flex-1`}>
            {children}
        </div>
    </div>
);

const Container = ({ title, children }: { title?: string, children: React.ReactNode }) => {
    const particles = useStoreState(state => state.settings.data!.particles);

    return (
        <div>
            {particles === '1' &&
            <Particles
                params={{
                    particles: {
                        number: {
                            value: 40,
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
                            speed: 3,
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
            }
            <Wrapper>
                {title &&
            <h2 css={tw`text-3xl text-center text-neutral-100 font-medium py-4`}>
                {title}
            </h2>
                }
                <FlashMessageRender css={tw`mb-2 px-1`}/>
                {children}
                <p css={tw`text-center text-neutral-500 text-xs mt-4`}>
                &copy; {(new Date()).getFullYear()}&nbsp;Jexactyl, built on <a href="https://pterodactyl.io">Pterodactyl</a>.
                </p>
            </Wrapper>
        </div>
    );
};

type FormContainerProps = React.DetailedHTMLProps<React.FormHTMLAttributes<HTMLFormElement>, HTMLFormElement> & {
    title?: string;
}

const FormContainer = forwardRef<HTMLFormElement, FormContainerProps>(({ title, ...props }, ref) => (
    <Container title={title}>
        <Form {...props} ref={ref}>
            <Inner>{props.children}</Inner>
        </Form>
    </Container>
));

type DivContainerProps = React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
    title?: string;
}

export const DivContainer = ({ title, ...props }: DivContainerProps) => (
    <Container title={title}>
        <div {...props}>
            <Inner>{props.children}</Inner>
        </div>
    </Container>
);

export default FormContainer;
