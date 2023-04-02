import { useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "@reduxjs/toolkit";
import { Table } from "antd";
import columns from "./layouts/table/columns";
import PopUpModal from "./layouts/modal/PopUpModal.jsx";
import * as actions from "../features/modalSlice.js";
import { fetchPanoramaImages } from "../features/imageSlice.js";
import { imageState, modalState } from "../lib/store.js";

const ImageTable = () => {
  // Extract the image and modal state from the Redux store
  const image = useSelector(imageState);
  const modal = useSelector(modalState);

  const dispatch = useDispatch<Dispatch<any>>();
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Fetching panorama images on component mount
  useEffect(() => {
    dispatch(fetchPanoramaImages());
  }, []);

  // Closing modal
  const handleCloseModal = useCallback(() => {
    dispatch(actions.closeModal());
  }, []);

  // Showing modal and switching tab
  const showModal = useCallback((imageInfo: any, activeTab: string) => {
    dispatch(actions.openModal(imageInfo));
    dispatch(actions.switchTab(activeTab));
  }, []);

  // Search results
  const handleSearch = useCallback(
    (selectedKeys: string[], confirm: (arg: { closeDropdown: boolean }) => void, dataIndex: string, dropdownStatus: boolean) => {
      confirm({ closeDropdown: dropdownStatus });
      dispatch(actions.setSearchText(selectedKeys[0]));
      dispatch(actions.setSearchedColumn(dataIndex));
    },
    []
  );

  // Reset search state
  const handleReset = useCallback((clearFilters: () => void) => {
    clearFilters();
    dispatch(actions.resetSearch());
  }, []);

  // Rendering table and modal
  return (
    <>
      <Table
        dataSource={image.panoramaImages}
        columns={columns(
          showModal,
          searchInputRef,
          handleSearch,
          handleReset,
          modal.searchedColumn,
          modal.searchText
        )}
        loading={image.isLoading}
        tableLayout="auto"
      />
      <PopUpModal visible={modal.isOpen} onCancel={handleCloseModal} />
    </>
  );
};

export default ImageTable;
