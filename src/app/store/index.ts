import { getData, storeData } from '@/utils';
import { createSlice, configureStore } from '@reduxjs/toolkit';

export interface CoverState {
	isLoading?: boolean;
	content?: string;
	description?: string;
	match?: string;
	missing?: string;
	type?: string;
	interview?: string;
}

const coverSlice = createSlice({
	name: 'cover',
	initialState: getData() || {
		isLoading: false,
		content: '',
		description: '',
		match: '',
		missing: '',
		interview: '',
	},
	reducers: {
		loading: (state) => {
			state.isLoading = true;
		},
		loaded: (state, { payload: { content, description } }) => {
			state.isLoading = false;
			state.content = content;
			storeData({ ...getData(), content, description });
		},
		missingLoaded: (state, { payload: { missing } }) => {
			state.missing = missing;
			storeData({ ...getData(), missing });
		},

		matchLoaded: (state, { payload: { match } }) => {
			state.match = match;
			storeData({ ...getData(), match });
		},
		interviewLoaded: (state, { payload: { interview } }) => {
			state.interview = interview;
			storeData({ ...getData(), interview });
		},
	},
});

export const { loading, loaded } = coverSlice.actions;

export const coverStore = configureStore({
	reducer: coverSlice.reducer,
});

export type RootState = ReturnType<typeof coverStore.getState>;
export const selectCoverContent = ({ content }: RootState) => content;
export const selectCoverMatch = ({ match }: RootState) => match;
export const selectCoverLoading = ({ isLoading }: RootState) => isLoading;
export const selectCoverDescription = ({ description }: RootState) => description;
export const selectCoverMissing = ({ missing }: RootState) => missing;
export const selectCoverInterview = ({ interview }: RootState) => interview;
