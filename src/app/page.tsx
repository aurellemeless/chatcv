'use client';
import { Provider as ReduxProvider } from 'react-redux';
import { Provider } from '@/components/ui/provider';
import CoverLetter from '@/components/ui/cover';
import CoverForm from '@/components/ui/cover/coverForm';
import { coverStore } from './store';

export default function Home() {
	return (
		<Provider>
			<ReduxProvider store={coverStore}>
				<CoverForm />
				<CoverLetter />
			</ReduxProvider>
		</Provider>
	);
}
