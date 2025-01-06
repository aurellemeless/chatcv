'use client';
import { Box, Card, IconButton, Textarea } from '@chakra-ui/react';
import { LuCopy } from 'react-icons/lu';
import { Toaster, toaster } from '../toaster';
import { selectCoverContent } from '@/app/store';
import { useSelector } from 'react-redux';

function CoverLetter() {
	const content = useSelector(selectCoverContent);

	const copyContent = (e: React.MouseEvent) => {
		e.preventDefault();
		navigator.clipboard.writeText(content as string);
		console.info('copied to clipboard !');
		toaster.create({
			title: 'copied',
			description: 'Your cover letter have been copied to the clipboard !',
			type: 'success',
		});
	};
	return (
		<Box width='100%' padding={4}>
			<Toaster />
			<Card.Root>
				<Card.Body gap='2'>
					<Card.Title mt='2'>cover letter</Card.Title>
					<Card.Description>
						<IconButton onClick={copyContent} aria-label='Copy to clipboard' variant='ghost'>
							<LuCopy />
						</IconButton>
						<Textarea size='lg' style={{ height: 520, width: '100%' }} value={content} />
					</Card.Description>
				</Card.Body>
				<Card.Footer justifyContent='flex-end'>
					<IconButton onClick={copyContent} aria-label='Copy to clipboard' variant='ghost'>
						<LuCopy />
					</IconButton>
				</Card.Footer>
			</Card.Root>
		</Box>
	);
}

export default CoverLetter;
