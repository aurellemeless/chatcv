import { getData, storeData } from '@/utils';
import { createSlice, configureStore } from '@reduxjs/toolkit';

export interface CoverState {
	isLoading?: boolean;
	content?: string;
	description?: string;
	match?: string;
	type?: string;
}

const coverSlice = createSlice({
	name: 'cover',
	initialState: getData() || {
		isLoading: false,
		content: '',
		description: '',
		match: '',
	},
	reducers: {
		loading: (state) => {
			state.isLoading = true;
		},
		loaded: (state, { payload: { content, description, match } }) => {
			state.isLoading = false;
			state.content = content;
			state.match = match;
			state.description = description;
			storeData({ content, match, description });
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
