import useSWR from 'swr';
import tw from 'twin.macro';
import useFlash from '@/plugins/useFlash';
import { number, object, string } from 'yup';
import { megabytesToHuman } from '@/helpers';
import { useStoreState } from '@/state/hooks';
import getConfig from '@/api/store/getConfig';
import Field from '@/components/elements/Field';
import Button from '@/components/elements/Button';
import React, { useEffect, useState } from 'react';
import createServer from '@/api/store/createServer';
import Spinner from '@/components/elements/Spinner';
import { Form, Formik, FormikHelpers } from 'formik';
import InputSpinner from '@/components/elements/InputSpinner';
import TitledGreyBox from '@/components/elements/TitledGreyBox';
import FlashMessageRender from '@/components/FlashMessageRender';
import PageContentBlock from '@/components/elements/PageContentBlock';
import { faHdd, faLayerGroup, faMicrochip, faMemory } from '@fortawesome/free-solid-svg-icons';

export interface ConfigResponse {
    user: any[];
}

interface CreateValues {
    name: string;
    cpu: number;
    ram: number;
    storage: number;
}

export default () => {
    const { addFlash, clearFlashes, clearAndAddHttpError } = useFlash();
    const [ isSubmit, setSubmit ] = useState(false);
    const [ loading, setLoading ] = useState(false);
    const user = useStoreState(state => state.user.data);
    const { data, error, mutate } = useSWR<ConfigResponse>([ '/store' ], () => getConfig());

    const submit = ({ name, cpu, ram, storage }: CreateValues, { setSubmitting }: FormikHelpers<CreateValues>) => {
        setLoading(true);
        clearFlashes('account:store');
        setSubmitting(false);
        setSubmit(true);

        createServer(name, cpu, ram, storage).then(() => {
            mutate();
            setSubmit(false);
        })
            .then(() => addFlash({
                type: 'success',
                key: 'account:store',
                message: 'Your server has been created!',
            }))
            .then(() => setLoading(false))
            .then(() => {
                // @ts-ignore
                window.location = '/';
            })
            .then(() => addFlash({
                type: 'success',
                key: 'account:store:deployed',
                message: 'Your server has been deployed and is now installing.',
            }))
            .catch(error => {
                setSubmitting(false);
                setSubmit(false);
                clearAndAddHttpError({ key: 'account:store', error });
            });
    };

    useEffect(() => {
        if (!error) {
            clearFlashes('account:store');
        } else {
            clearAndAddHttpError({ key: 'account:store', error });
        }
    });

    return (
        <PageContentBlock title={'Create a Server'} css={tw`flex flex-wrap`}>
            <div css={tw`w-full`}>
                <FlashMessageRender byKey={'account:store'} css={tw`mb-4`} />
            </div>
            {!data ?
                <div css={tw`w-full`}>
                    <Spinner size={'large'} centered />
                </div>
                :
                <>
                    <h3 css={tw`mt-8 mb-2 text-2xl`}>New Server</h3>
                    <div css={tw`w-full`}>
                        <Formik
                            onSubmit={submit}
                            initialValues={{
                                name: `${user!.username}'s server`,
                                cpu: user!.crCpu,
                                ram: user!.crRam / 1024,
                                storage: user!.crStorage / 1024,
                            }}
                            validationSchema={object().shape({
                                name: string().required().min(3),
                                cpu: number().required().min(50).max(user!.crCpu),
                                ram: number().required().min(1).max(user!.crRam / 1024),
                                storage: number().required().min(1).max(user!.crStorage / 1024),
                            })}
                        >
                            <Form>
                                <div css={tw`grid gap-8 md:grid-cols-2`}>

                                    <TitledGreyBox title={'Server Name'} icon={faLayerGroup}>
                                        <div css={tw`px-1 py-2`}>
                                            <Field
                                                name={'name'}
                                            />
                                            <p css={tw`mt-1 text-xs text-neutral-400`}>Character limits: <code>a-z A-Z 0-9 _ - .</code> and <code>[Space]</code>.</p>
                                            <p css={tw`mt-1 text-xs text-neutral-400`}>Assign a name to your server for use in the Panel.</p>
                                        </div>
                                    </TitledGreyBox>
                                    <TitledGreyBox title={'Server CPU'} icon={faMicrochip}>
                                        <div css={tw`px-1 py-2`}>
                                            <Field
                                                name={'cpu'}
                                            />
                                            <p css={tw`mt-1 text-xs text-neutral-400`}>{user!.crCpu}% available</p>
                                            <p css={tw`mt-1 text-xs text-neutral-400`}>Assign CPU cores and threads to your server. (100% = 1 thread)</p>
                                        </div>
                                    </TitledGreyBox>
                                    <TitledGreyBox title={'Server RAM'} icon={faMemory}>
                                        <div css={tw`px-1 py-2`}>
                                            <Field
                                                name={'ram'}
                                            />
                                            <p css={tw`mt-1 text-xs text-neutral-400`}>{megabytesToHuman(user!.crRam)} available</p>
                                            <p css={tw`mt-1 text-xs text-neutral-400`}>The maximum amount of memory allowed for this server in GB.</p>
                                        </div>
                                    </TitledGreyBox>
                                    <TitledGreyBox title={'Server Storage'} icon={faHdd}>
                                        <div css={tw`px-1 py-2`}>
                                            <Field
                                                name={'storage'}
                                            />
                                            <p css={tw`mt-1 text-xs text-neutral-400`}>{megabytesToHuman(user!.crStorage)} available</p>
                                            <p css={tw`mt-1 text-xs text-neutral-400`}>The maximum amount of storage allowed for this server in GB.</p>
                                        </div>
                                    </TitledGreyBox>
                                </div>
                                <br></br>
                                <div css={tw`flex justify-end text-right`}>
                                    <InputSpinner visible={loading}>
                                        <Button type={'submit'} disabled={isSubmit}>Create Servers</Button>
                                    </InputSpinner>
                                </div>
                            </Form>
                        </Formik>
                    </div>
                </>
            }
        </PageContentBlock>
    );
};
