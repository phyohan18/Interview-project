import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the shape of the state
interface ModalState {
  isOpen: boolean;
  modalData: any;
  activeTab: string | undefined;
  searchText: string;
  searchedColumn: string;
}

// Set the initial state for the modal slice
const initialState: ModalState = {
  isOpen: false,
  modalData: null,
  activeTab: undefined,
  searchText: "",
  searchedColumn: "",
};

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    // Update the state when the modal is opened
    openModal: (state, action: PayloadAction<any>) => {
      state.isOpen = true;
      state.modalData = action.payload;
    },
    // Update the state when the modal is closed
    closeModal: (state) => {
      state.isOpen = false;
    },
    // Update the state when the active tab is switched
    switchTab: (state, action: PayloadAction<string>) => {
      state.activeTab = action.payload;
    },
    // Update the state when the search text changes
    setSearchText: (state, action: PayloadAction<string>) => {
      state.searchText = action.payload;
    },
    // Update the state when the searched column changes
    setSearchedColumn: (state, action: PayloadAction<string>) => {
      state.searchedColumn = action.payload;
    },
    // Reset the search text to empty string
    resetSearch: (state) => {
      state.searchText = "";
    },
  },
});

// Export the action creators
export const {
  openModal,
  closeModal,
  switchTab,
  setSearchText,
  setSearchedColumn,
  resetSearch,
} = modalSlice.actions;

// Export the reducer
export default modalSlice.reducer;
