import { selectCoverMatch } from '@/app/store';
import { Box, Card } from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import Markdown from 'react-markdown';

function MatchOffer() {
	const match = useSelector(selectCoverMatch);
	return (
		<Box width='100%' padding={4}>
			<Card.Root>
				<Card.Body gap='2'>
					<Card.Title mt='2'>Match</Card.Title>
					<Card.Description>
						<Markdown>{match}</Markdown>
					</Card.Description>
				</Card.Body>
			</Card.Root>
		</Box>
	);
}

export default MatchOffer;
