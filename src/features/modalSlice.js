import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isOpen: false,
  modalData: null,
  modalTab: null,
  searchText: "",
  searchedColumn: "",
};

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    openModal: (state, action) => {
      state.isOpen = true;
      state.modalData = action.payload;
    },
    closeModal: (state) => {
      state.isOpen = false;
    },
    switchTab: (state, action) => {
      state.modalTab = action.payload;
    },
    setSearchText: (state, action) => {
      state.searchText = action.payload;
    },
    setSearchedColumn: (state, action) => {
      state.searchedColumn = action.payload;
    },
    resetSearch: (state, action) => {
      state.searchText = "";
    },
  },
});

export const {
  openModal,
  closeModal,
  switchTab,
  setSearchText,
  setSearchedColumn,
  resetSearch
} = modalSlice.actions;

export default modalSlice.reducer;
