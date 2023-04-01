import { useEffect,useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchPanoramaImages } from "../features/imageSlice.js";
import {
  openModal,
  closeModal,
  switchTab,
  setSearchText,
  setSearchedColumn,
  resetSearch
} from "../features/modalSlice.js";
import { Table } from "antd";
import columns from "./layouts/table/columns.jsx";
import PopUpModal from "./layouts/modal/PopUpModal.jsx";

const ImageTable = () => {
  // Getting image and modal data from redux store
  const image = useSelector((state) => state.image);
  const modal = useSelector((state) => state.modal);
  const dispatch = useDispatch();

  const searchInput = useRef()

  // Fetching panorama images on component mount
  useEffect(() => {
    dispatch(fetchPanoramaImages());
  }, []);

  // Closing modal
  const handleCloseModal = () => {
    dispatch(closeModal());
  };

  // Showing modal and switching tab
  const showModal = (imageInfo, activeTab) => {
    dispatch(openModal({ ...imageInfo }));
    dispatch(switchTab(activeTab));
  };

  const handleSearch = (selectedKeys, confirm, dataIndex , closeDropdown) => {
    confirm({ closeDropdown: closeDropdown });
    dispatch(setSearchText(selectedKeys[0]));
    dispatch(setSearchedColumn(dataIndex));
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    dispatch(resetSearch());
  };

  // Rendering table and modal
  return (
    <>
      <Table
        dataSource={image.panoramaImages}
        columns={columns(showModal,searchInput,modal.searchedColumn,modal.searchText, handleSearch,handleReset)}
        loading={image.isLoading}
        tableLayout="auto"
      />
      <PopUpModal visible={modal.isOpen} onCancel={handleCloseModal}/>
    </>
  );
};

export default ImageTable;
