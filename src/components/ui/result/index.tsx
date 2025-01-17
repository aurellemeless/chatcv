import { selectCoverInterview, selectCoverMatch, selectCoverMissing } from '@/app/store';
import CoverLetter from '../cover';
import { useSelector } from 'react-redux';
import ChatCard from '../card';

function ResultLayer() {
	const match = useSelector(selectCoverMatch);
	const missing = useSelector(selectCoverMissing);
	const interview = useSelector(selectCoverInterview);
	return (
		<>
			<CoverLetter />
			<ChatCard title='Match' content={match} />
			<ChatCard title='Missing' content={missing} />
			<ChatCard title='Interview Questions' content={interview} />
		</>
	);
}

export default ResultLayer;
