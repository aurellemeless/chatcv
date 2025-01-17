'use client';
import { Provider as ReduxProvider } from 'react-redux';
import { Provider } from '@/components/ui/provider';
import CoverForm from '@/components/ui/cover/coverForm';
import { coverStore } from './store';
import ResultLayer from '@/components/ui/result';

export default function Home() {
	return (
		<Provider>
			<ReduxProvider store={coverStore}>
				<CoverForm />
				<ResultLayer />
			</ReduxProvider>
		</Provider>
	);
}
