import React, { useEffect, useState } from 'react';
import PageContentBlock from '@/components/elements/PageContentBlock';
import useFlash from '@/plugins/useFlash';
import tw from 'twin.macro';
import TitledGreyBox from '@/components/elements/TitledGreyBox';
import { Form, Formik, FormikHelpers } from 'formik';
import Button from '@/components/elements/Button';
import { number, object, string } from 'yup';
import Field from '@/components/elements/Field';
import createServer from '@/api/store/createServer';
import getConfig from '@/api/store/getConfig';
import { faHdd, faLayerGroup, faMicrochip, faMemory, faPuzzlePiece } from '@fortawesome/free-solid-svg-icons';
import { megabytesToHuman } from '@/helpers';
import { useStoreState } from '@/state/hooks';
import { RouteComponentProps } from 'react-router-dom';
import useSWR from 'swr';
import Spinner from '@/components/elements/Spinner';
import FlashMessageRender from '@/components/FlashMessageRender';

export interface ConfigResponse {
    user: any[];
}

type Props = {
    id: string;
}

interface CreateValues {
    name: string;
    cpu: number;
    ram: number;
    storage: number;
    egg: number;
}

export default ({ match }: RouteComponentProps<Props>) => {
    const id = match.params.id;
    const { addFlash, clearFlashes, clearAndAddHttpError } = useFlash();
    const [ isSubmit, setSubmit ] = useState(false);
    const user = useStoreState(state => state.user.data);
    const { data, error, mutate } = useSWR<ConfigResponse>([ id, '/store' ], (id) => getConfig(id));

    const submit = ({ name, cpu, ram, storage, egg }: CreateValues, { setSubmitting }: FormikHelpers<CreateValues>) => {
        clearFlashes('account:store');
        setSubmitting(false);
        setSubmit(true);

        createServer(name, cpu, ram, storage, egg).then(() => {
            mutate();
            setSubmit(false);
        })
            .then(() => addFlash({
                type: 'success',
                key: 'account:store',
                message: 'Your server has been created!',
            }))
            .then(() => {
                // @ts-ignore
                window.location = '/';
            })
            .catch(error => {
                setSubmitting(false);
                setSubmit(false);
                clearAndAddHttpError(error);
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
                                name: 'My Server',
                                cpu: 0,
                                ram: 0,
                                storage: 0,
                                egg: 0,
                            }}
                            validationSchema={object().shape({
                                name: string().required(),
                                cpu: number().required(),
                                ram: number().required(),
                                storage: number().required(),
                                egg: number().required(),
                            })}
                        >
                            <Form>
                                <div css={tw`flex flex-wrap`}>
                                    <div css={tw`lg:w-6/12 lg:pl-4 pt-4`}>
                                        <TitledGreyBox title={'Server Name'} icon={faLayerGroup}>
                                            <div css={tw`px-1 py-2`}>
                                                <Field
                                                    name={'name'}
                                                />
                                                <p css={tw`mt-1 text-xs text-neutral-400`}>Character limits: <code>a-z A-Z 0-9 _ - .</code> and <code>[Space]</code>.</p>
                                                <p css={tw`mt-1 text-xs text-neutral-400`}>Assign a name to your server for use in the Panel.</p>
                                            </div>
                                        </TitledGreyBox>
                                    </div>
                                    <div css={tw`lg:w-6/12 lg:pl-4 pt-4`}>
                                        <TitledGreyBox title={'Server CPU'} icon={faMicrochip}>
                                            <div css={tw`px-1 py-2`}>
                                                <Field
                                                    name={'cpu'}
                                                />
                                                <p css={tw`mt-1 text-xs text-neutral-400`}>{user!.crCpu}% available</p>
                                                <p css={tw`mt-1 text-xs text-neutral-400`}>Assign CPU cores and threads to your server. (100% = 1 thread)</p>
                                            </div>
                                        </TitledGreyBox>
                                    </div>
                                    <div css={tw`lg:w-6/12 lg:pl-4 pt-4`}>
                                        <TitledGreyBox title={'Server RAM'} icon={faMemory}>
                                            <div css={tw`px-1 py-2`}>
                                                <Field
                                                    name={'ram'}
                                                />
                                                <p css={tw`mt-1 text-xs text-neutral-400`}>{megabytesToHuman(user!.crRam)} available</p>
                                                <p css={tw`mt-1 text-xs text-neutral-400`}>The maximum amount of memory allowed for this server in GB.</p>
                                            </div>
                                        </TitledGreyBox>
                                    </div>
                                    <div css={tw`lg:w-6/12 lg:pl-4 pt-4`}>
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
                                    <div css={tw`lg:w-6/12 lg:pl-4 pt-4`}>
                                        <TitledGreyBox title={'Server Egg ID'} icon={faPuzzlePiece}>
                                            <div css={tw`px-1 py-2`}>
                                                <Field
                                                    name={'egg'}
                                                />
                                                <p css={tw`mt-1 text-xs text-neutral-400`}>The egg ID to use for this server.</p>
                                            </div>
                                        </TitledGreyBox>
                                    </div>
                                </div>
                                <br></br>
                                <div css={tw`flex justify-end text-right`}>
                                    <Button type={'submit'} disabled={isSubmit}>Create</Button>
                                </div>
                            </Form>
                        </Formik>
                    </div>
                </>
            }
        </PageContentBlock>
    );
};
