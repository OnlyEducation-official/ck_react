import { useFieldArray, useForm } from 'react-hook-form'
import MainEditor from '../components/MainEditor'
import QuestionCard from './QuestionCard'
import SelectComponent from './SelectComponent';
import { Box, Button, Container, Grid } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import CheckBox from './CheckBox';

export default function QuestionPreview2() {
    const [isLoading, setIsLoading] = useState(false);

    const { control, setValue, watch, handleSubmit, reset } = useForm({
        defaultValues: {
            question_title: '',
            explanation: '',
            options: [
                {
                    option_label: '',
                    is_correct: false,
                    option: '',
                },
            ],

        }
    });
    // console.log('watch', watch())

    const { fields, append } = useFieldArray({
        control,
        name: "options",
    });

    const handleEditorChange = useCallback((html, { docId }) => {
        setValue(docId, html);
    }, []);

    const onSubmitt = (data) => {
        console.log('submit', data);
        // const payload = {
        //     data: data
        // };
        // console.log('payload: ', payload);
        const response = fetch('https://admin.onlyeducation.co.in/api/t-questions/245', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer 396dcb5c356426f8c3ce8303bcdc6feb5ecb1fd4aa4aaa59e42e1c7f82b6385cf4107d023cc58cfd61294adb023993a8e58e0aad8759fbf44fc020c1ac02f492c9d42d1f7dc12fc05c8144fbe80f06850c79d4b823241c83c5e153b03d1f8d0316fb9dec1a531c0df061e1f242bab549f17f715b900ba9546f6a6351fdd7dfa8'
            },
            body: JSON.stringify({ data: data }),
        })
        console.log('response', response);
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const response = await fetch('https://admin.onlyeducation.co.in/api/t-questions/245?populate[options]=true');
                const { data } = await response.json();
                console.log('data: ', data);

                reset(data.attributes);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    if (isLoading) return <div>Loading...</div>;

    return (
        <Container maxWidth='xl' >
            <Box component={'form'} onSubmit={handleSubmit(onSubmitt)}>
                <div className='flex flex-col gap-4 py-12'>
                    <div>
                        <h1 className='text-xl'>{`1) Question title`}</h1>
                        <MainEditor docId={'question_title'} initialHTML={watch('question_title')} onChange={handleEditorChange} />
                    </div>
                    <div>
                        <h2 className='text-xl'>{`2) Question Explaination`}</h2>
                        <MainEditor docId={'explanation'} initialHTML={watch('explanation')} onChange={handleEditorChange} />
                    </div>
                    <Grid container spacing={2}>
                        {fields.map((field, index) => (
                            <Grid size={6} sx={{ display: 'flex', flexDirection: 'column', gap: 2, border: '1px solid grey', padding: 2, borderRadius: 2 }} key={field.id}>
                                <Box>Option {index + 1}</Box>
                                <SelectComponent
                                    control={control}
                                    name={`options.${index}.option_label`}
                                    label='Option_Label'
                                // value={watch(`options.${index}.option_label`)} name={`options.${index}.option_label`} setValue={setValue}
                                />
                                <Box>

                                    <CheckBox checked={watch(`options.${index}.is_correct`)} name={`options.${index}.is_correct`} setValue={setValue} />
                                </Box>
                                {/* <Box>
                                <Button variant={watch(`options.${index}.is_correct`) === true ? 'contained' : 'outlined'}>True</Button>
                                <Button variant={watch(`options.${index}.is_correct`) === true ? 'contained' : 'outlined'}>False</Button>
                            </Box> */}
                                <h2 className='text-xl'>Option</h2>
                                <MainEditor docId={`options.${index}.option`} initialHTML={watch(`options.${index}.option`)} onChange={handleEditorChange} />
                            </Grid>

                        ))}
                    </Grid>
                    <Box sx={{ paddingBlockStart: 6 }}>
                        <Button variant='outlined' color='secondary' onClick={() => append({ option_label: '', is_correct: false, option: '' })}>Add Option</Button>
                    </Box>
                </div>
                <Button variant='contained' type='submit'>Submit</Button>
            </Box>
        </Container>
    )
}
