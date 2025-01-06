import { createSlice, configureStore } from '@reduxjs/toolkit';

export interface CoverState {
	isLoading?: boolean;
	content?: string;
	type?: string;
}

const coverSlice = createSlice({
	name: 'cover',
	initialState: {
		isLoading: false,
		content: '',
	},
	reducers: {
		loading: (state) => {
			state.isLoading = true;
		},
		loaded: (state, { payload: { content } }) => {
			state.isLoading = false;
			state.content = content;
		},
	},
});

export const { loading, loaded } = coverSlice.actions;

export const coverStore = configureStore({
	reducer: coverSlice.reducer,
});

export type RootState = ReturnType<typeof coverStore.getState>;
export const selectCoverContent = (state: RootState) => state.content;
export const selectCoverLoading = (state: RootState) => state.isLoading;
