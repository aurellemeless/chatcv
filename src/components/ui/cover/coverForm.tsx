import { Box, Flex, Heading, Stack, Textarea } from '@chakra-ui/react';
import { useFormik } from 'formik';
import {
	FileUploadDropzone,
	FileUploadLabel,
	FileUploadList,
	FileUploadRoot,
} from '../file-upload';
import { StepperInput } from '../stepper-input';
import { Button } from '../button';
import { useState } from 'react';
import { ProgressCircleRing, ProgressCircleRoot } from '../progress-circle';
import { CoverPromptType } from '@/contracts/CoverPromptType';
import { callApi, extractTextFromPDF, getPrompt } from '@/utils';
import { Field } from '../field';
import { selectCoverDescription, selectCoverLoading } from '@/app/store';
import { useDispatch, useSelector } from 'react-redux';
import {
	PROMPT_BASE,
	PROMPT_INTERVIEW_BASE,
	PROMPT_MATCH_BASE,
	PROMPT_MISSING_BASE,
} from '@/utils/constants';

export interface CallApiType {
	data: CoverPromptType;
	action: (arg: string) => void;
}

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
			generateCover({ maxWords, description, cv: pdfText } as CoverPromptType);
		},
	});

	const generateCover = ({ cv, description, maxWords }: CoverPromptType) => {
		const data: CallApiType[] = [
			{
				data: { cv, description, maxWords, promptBase: PROMPT_BASE },
				action: (a: string) =>
					dispatch({
						payload: { content: a },
						type: 'cover/loaded',
					}),
			},
			{
				data: { cv, description, maxWords, promptBase: PROMPT_MATCH_BASE },
				action: (a: string) =>
					dispatch({
						payload: { match: a },
						type: 'cover/matchLoaded',
					}),
			},
			{
				data: { cv, description, maxWords, promptBase: PROMPT_MISSING_BASE },
				action: (a: string) =>
					dispatch({
						payload: { missing: a },
						type: 'cover/missingLoaded',
					}),
			},
			{
				data: { cv, description, maxWords, promptBase: PROMPT_INTERVIEW_BASE },
				action: (a: string) =>
					dispatch({
						payload: { interview: a },
						type: 'cover/interviewLoaded',
					}),
			},
		];
		dispatch({
			payload: { isLoading: true },
			type: 'cover/loading',
		});

		data.map(({ data, action }) => callApi('cover', getPrompt(data), action));
	};

	const onFileAccept = async ({ files }: { files: File[] }) => {
		const [acceptedFile] = files;
		const reader = new FileReader();
		reader.onloadend = async () => {
			const text = await extractTextFromPDF(reader.result || '');
			setPdfText(text);
		};
		reader.readAsArrayBuffer(acceptedFile);
	};

	return (
		<form onSubmit={formik.handleSubmit}>
			<Flex gap={3} padding={4} flexDirection={'column'} alignItems={'center'}>
				<Flex gap={2} width={'100%'} flexDirection={'column'} alignItems={'center'}>
					<Heading marginTop={2}>Get a free cover letter</Heading>
					<Field required errorText='the resume is required'>
						<FileUploadRoot
							alignSelf='center'
							required
							onFileAccept={onFileAccept}
							allowDrop
							maxW='xl'
							alignItems='stretch'
							maxFiles={1}
							name='cv'
						>
							<FileUploadLabel>Upload your resume</FileUploadLabel>
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
							<Field label='Cover letter length in words'>
								<StepperInput
									step={20}
									min={80}
									name='tsize'
									onChange={formik.handleChange}
									value={formik.values.letterSize.toString()}
									onValueChange={(e) => formik.setFieldValue('letterSize', e.value)}
								/>
							</Field>
							<Button type='submit' disabled={isLoading}>
								Get a cover letter
							</Button>
							{isLoading && (
								<ProgressCircleRoot alignSelf='center' value={null}>
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
