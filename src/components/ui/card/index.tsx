import React from 'react';
import { Box, Card } from '@chakra-ui/react';
import Markdown from 'react-markdown';

interface ChatCardProps {
	title: string | null;
	content: string | null;
}

function ChatCard({ content, title }: ChatCardProps) {
	return (
		<Box width='100%' padding={4}>
			<Card.Root>
				<Card.Body gap='2'>
					{title && <Card.Title mt='2'>{title}</Card.Title>}
					<Card.Description>
						<Markdown>{content}</Markdown>
					</Card.Description>
				</Card.Body>
			</Card.Root>
		</Box>
	);
}

export default ChatCard;
