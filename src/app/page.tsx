'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FileUploadList, FileUploadDropzone, FileUploadRoot } from '@/components/ui/file-upload';
import { Provider } from '@/components/ui/provider';
import { Box, Card, Flex, Heading, IconButton, Input, Stack, Textarea } from '@chakra-ui/react';
import { ProgressCircleRing, ProgressCircleRoot } from '@/components/ui/progress-circle';
import { extractTextFromPDF, getPrompt, sendToChatCv } from '@/utils';
import { useFormik } from 'formik';
import { StepperInput } from '@/components/ui/stepper-input';
import { Field } from '@/components/ui/field';
import { LuCopy } from 'react-icons/lu';

export default function Home() {
	const [showCover, setShowCover] = useState<boolean>(false);
	const [isLoading, setIsloading] = useState<boolean>(false);
	const [pdfText, setPdfText] = useState<string | null>(null);
	const [coverLetter, setCoverLetter] = useState<string | null>(null);

	const formik = useFormik({
		initialValues: {
			tsize: 120,
			url: '',
		},
		onSubmit: (values) => {
			console.log(JSON.stringify(values, null, 2));
			generateCover();
			console.log('coverLetter ', coverLetter);
		},
	});

	const generateCover = async () => {
		setIsloading(true);
		const letter = await sendToChatCv(
			getPrompt(pdfText as string, formik.values.url, formik.values.tsize)
		);
		setCoverLetter(letter);
		setShowCover(true);
		setIsloading(false);
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

	const copyCoverLetter = (e) => {
		e.preventDefault();
		navigator.clipboard.writeText(coverLetter as string);
		console.info('copied to clipboard !');
	};

	return (
		<Provider>
			<form onSubmit={formik.handleSubmit}>
				<Flex gap={3} padding={4} flexDirection={'column'} alignItems={'center'}>
					<Flex gap={2} width={'100%'} flexDirection={'column'} alignItems={'center'}>
						<Heading marginTop={2}>Get a free cover letter</Heading>
						<Field required label='Upload your resume'>
							<FileUploadRoot
								required
								onFileAccept={onFileAccept}
								allowDrop
								maxW='xl'
								alignItems='stretch'
								maxFiles={10}
								name='cv'
							>
								<FileUploadDropzone
									label='Drag and drop here to upload your resume'
									description='.pdf, .doc, .docx, up to 5MB'
								/>
								<FileUploadList clearable />
							</FileUploadRoot>
						</Field>
					</Flex>

					<Box width={'100%'}>
						<Stack gap='4'>
							<Field label='Job description URL' required>
								<Input
									placeholder='Job description URL'
									name='url'
									onChange={formik.handleChange}
									value={formik.values.url}
									size='lg'
								/>
							</Field>
							<Field label='job description' required={!formik.values.url.length}>
								<Textarea size='xl' placeholder='Job description ' />
							</Field>
							<Field label='cover letter length in words'>
								<StepperInput
									step={20}
									name='tsize'
									onChange={formik.handleChange}
									value={formik.values.tsize.toString()}
									onValueChange={(e) => formik.setFieldValue('tsize', e.value)}
								/>
							</Field>
							<Button type='submit'> Generate a cover letter</Button>
						</Stack>
					</Box>
					{isLoading && (
						<div>
							<ProgressCircleRoot value={null}>
								<ProgressCircleRing />
							</ProgressCircleRoot>
						</div>
					)}

					{showCover && (
						<Box width='100%'>
							<Card.Root>
								<Card.Body gap='2'>
									<Card.Title mt='2'>Cover letter</Card.Title>
									<Card.Description>
										<IconButton
											onClick={copyCoverLetter}
											aria-label='Copy to clipboard'
											variant='ghost'
										>
											<LuCopy />
										</IconButton>
										<Textarea
											size='lg'
											style={{ height: 520, width: '100%' }}
											value={coverLetter as string}
										/>
									</Card.Description>
								</Card.Body>
								<Card.Footer justifyContent='flex-end'>
									<IconButton
										onClick={copyCoverLetter}
										aria-label='Copy to clipboard'
										variant='ghost'
									>
										<LuCopy />
									</IconButton>
								</Card.Footer>
							</Card.Root>
						</Box>
					)}
				</Flex>
			</form>
		</Provider>
	);
}
