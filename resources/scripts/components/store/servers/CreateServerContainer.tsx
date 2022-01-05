import React, { useState } from 'react';
import PageContentBlock from '@/components/elements/PageContentBlock';
import useFlash from '@/plugins/useFlash';
import tw from 'twin.macro';
import TitledGreyBox from '@/components/elements/TitledGreyBox';
import { Form, Formik, FormikHelpers } from 'formik';
import Button from '@/components/elements/Button';
import { number, object, string } from 'yup';
import Field from '@/components/elements/Field';
import createServer from '@/api/store/createServer';
import { faHdd, faLayerGroup, faMemory } from '@fortawesome/free-solid-svg-icons';
import { megabytesToHuman } from '@/helpers';
import { useStoreState } from '@/state/hooks';

interface CreateValues {
    name: string;
    cpu: number;
    ram: number;
    storage: number;
}

export default () => {
    const { clearAndAddHttpError } = useFlash();
    const [ isSubmit, setSubmit ] = useState(false);
    const user = useStoreState(state => state.user.data);

    const submit = ({ name, cpu, ram, storage }: CreateValues, { setSubmitting }: FormikHelpers<CreateValues>) => {
        console.log('Submit function has been triggered, attempting API POST now...');
        setSubmitting(false);
        setSubmit(true);

        createServer(name, cpu, ram, storage).then(() => {
            console.info('Jexactyl Debug\nSubmitting the following data to API...\n');
            console.info('Name: ' + name + ', CPU: ' + cpu + ', RAM: ' + ram + ', Storage:' + storage);
            console.warn('POST data submitted to /api/client/store');
            setSubmit(false);
        })
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

    return (
        <PageContentBlock title={'Create a Server'} css={tw`flex flex-wrap`}>
            <h3 css={tw`mt-8 mb-2 text-2xl`}>New Server</h3>
            <div css={tw`w-full`}>
                <Formik
                    onSubmit={submit}
                    initialValues={{
                        name: 'My Server',
                        cpu: 50,
                        ram: 1,
                        storage: 1,
                    }}
                    validationSchema={object().shape({
                        name: string().required(),
                        cpu: number().required(),
                        ram: number().required(),
                        storage: number().required(),
                    })}
                >
                    <Form>
                        <div css={tw`flex flex-wrap`}>
                            <div css={tw`lg:w-6/12 lg:pl-4 pt-4`}>
                                <TitledGreyBox title={'Server Name'} icon={faLayerGroup}>
                                    <div css={tw`px-1 py-2`}>
                                        <Field
                                            name={'name'}
                                            placeholder={'Server Name'}
                                        />
                                        <p css={tw`mt-1 text-xs text-neutral-400`}>Assign a name to your server for use in the Panel.</p>
                                    </div>
                                </TitledGreyBox>
                            </div>
                            <div css={tw`lg:w-6/12 lg:pl-4 pt-4`}>
                                <TitledGreyBox title={'Server Name'} icon={faLayerGroup}>
                                    <div css={tw`px-1 py-2`}>
                                        <Field
                                            name={'cpu'}
                                            placeholder={'Server CPU'}
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
                                            placeholder={'4'}
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
                                            placeholder={'16'}
                                        />
                                        <p css={tw`mt-1 text-xs text-neutral-400`}>{megabytesToHuman(user!.crStorage)} available</p>
                                        <p css={tw`mt-1 text-xs text-neutral-400`}>The maximum amount of storage allowed for this server in GB.</p>
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
        </PageContentBlock>
    );
};
