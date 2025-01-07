import { createSlice, configureStore } from '@reduxjs/toolkit';

export interface CoverState {
	isLoading?: boolean;
	content?: string;
	match?: string;
	type?: string;
}

const coverSlice = createSlice({
	name: 'cover',
	initialState: {
		isLoading: false,
		content: '',
		match: '',
	},
	reducers: {
		loading: (state) => {
			state.isLoading = true;
		},
		loaded: (state, { payload: { content, match } }) => {
			state.isLoading = false;
			state.content = content;
			state.match = match;
		},
	},
});

export const { loading, loaded } = coverSlice.actions;

export const coverStore = configureStore({
	reducer: coverSlice.reducer,
});

export type RootState = ReturnType<typeof coverStore.getState>;
export const selectCoverContent = (state: RootState) => state.content;
export const selectCoverMatch = (state: RootState) => state.match;
export const selectCoverLoading = (state: RootState) => state.isLoading;
