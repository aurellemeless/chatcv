import { Box, Flex, Heading, Stack, Textarea } from '@chakra-ui/react';
import { useFormik } from 'formik';
import { FileUploadDropzone, FileUploadList, FileUploadRoot } from '../file-upload';
import { StepperInput } from '../stepper-input';
import { Button } from '../button';
import { useState } from 'react';
import { ProgressCircleRing, ProgressCircleRoot } from '../progress-circle';
import { CoverPromptType } from '@/contracts/CoverPromptType';
import { extractTextFromPDF, getPrompt, sendToChatCv } from '@/utils';
import { Field } from '../field';
import { selectCoverDescription, selectCoverLoading } from '@/app/store';
import { useDispatch, useSelector } from 'react-redux';
import { PROMPT_BASE, PROMPT_MATCH_BASE } from '@/utils/constants';

function CoverForm() {
	const dispatch = useDispatch();
	const isLoading = useSelector(selectCoverLoading);
	const storeDescription = useSelector(selectCoverDescription);
	const [pdfText, setPdfText] = useState<string | null>(null);

	const formik = useFormik({
		initialValues: {
			letterSize: 120,
			description: storeDescription || '',
		},
		onSubmit: async (values) => {
			const { description, letterSize: maxWords } = values;
			await generateCover({ maxWords, description, cv: pdfText } as CoverPromptType);
		},
	});

	const generateCover = async ({ cv, description, maxWords }: CoverPromptType) => {
		dispatch({ payload: { isLoading: true }, type: 'cover/loading' });
		const letter = await sendToChatCv(
			'cover',
			getPrompt({ cv, description, maxWords, promptBase: PROMPT_BASE })
		);
		const match = await sendToChatCv(
			'match',
			getPrompt({ cv, description, maxWords: 200, promptBase: PROMPT_MATCH_BASE })
		);
		dispatch({ payload: { content: letter as string, match, description }, type: 'cover/loaded' });
	};

	const onFileAccept = async ({ files }: { files: File[] }) => {
		const [acceptedFile] = files;
		const reader = new FileReader();
		reader.onloadend = async () => {
			const text = await extractTextFromPDF(reader.result);
			setPdfText(text);
		};
		reader.readAsArrayBuffer(acceptedFile);
	};

	return (
		<form onSubmit={formik.handleSubmit}>
			<Flex gap={3} padding={4} flexDirection={'column'} alignItems={'center'}>
				<Flex gap={2} width={'100%'} flexDirection={'column'} alignItems={'center'}>
					<Heading marginTop={2}>Get a free cover letter</Heading>
					<Field required label='Upload your resume' errorText='the resume is required'>
						<FileUploadRoot
							required
							onFileAccept={onFileAccept}
							allowDrop
							maxW='xl'
							alignItems='stretch'
							maxFiles={1}
							name='cv'
						>
							<FileUploadDropzone
								label='Drag and drop here to upload your resume'
								description='.pdf, .doc, .docx, up to 5MB'
							/>
							<FileUploadList clearable />
						</FileUploadRoot>
					</Field>

					<Box width={'100%'}>
						<Stack gap='4'>
							<Field
								label='Job description / job link'
								required
								errorText='job description is required'
							>
								<Textarea
									size='xl'
									name='description'
									onChange={formik.handleChange}
									value={formik.values.description}
									placeholder='Put the job description or job url here'
								/>
							</Field>
							<Field label='cover letter length in words'>
								<StepperInput
									step={20}
									min={80}
									name='tsize'
									onChange={formik.handleChange}
									value={formik.values.letterSize.toString()}
									onValueChange={(e) => formik.setFieldValue('letterSize', e.value)}
								/>
							</Field>
							<Button type='submit'> get a cover letter</Button>
							{isLoading && (
								<ProgressCircleRoot value={null}>
									<ProgressCircleRing />
								</ProgressCircleRoot>
							)}
						</Stack>
					</Box>
				</Flex>
			</Flex>
		</form>
	);
}

export default CoverForm;
