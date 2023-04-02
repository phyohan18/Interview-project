import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchImageData } from "../lib/sanityClient";
import exifr from "exifr";

// Define constant variables
const GOOGLE_API_KEY = "AIzaSyD-fxP3MVBZnFGdpRiebKHwf65QSPvkbbc"

// Define the shape of the state
interface ImageState {
  panoramaImages: Array<any>;
  imageDetails: any | null;
  imageUrl: string | null;
  imageAvailableFeatures: any | null;
  activeTab: string | undefined;
  isLoading: boolean;
}

// Set the initial state for the modal slice
const initialState: ImageState = {
  panoramaImages: [],
  imageDetails: null,
  imageUrl: null,
  imageAvailableFeatures: null,
  activeTab: undefined,
  isLoading: true,
};

//Fetch Panorama Images from the Sanity.io Server
export const fetchPanoramaImages = createAsyncThunk<Array<any>, void>(
  "image/fetchPanoramaImages",
  async () => {
    const imageData = await fetchImageData();
    const processedImages = await processImageData(imageData);
    return processedImages;
  }
);

// Extract Metadata using Exifr
async function processImageData(imageData: Array<any>) {
  return await Promise.all(
    imageData.map(async (item, index) => {
      const { width, height } = item.image.metadata.dimensions;
      const exifData = await exifr.parse(`/panorama/${item.title}.jpg`);
      return {
        key: index + 1,
        fileName: item.title,
        fileURL: item.image.url,
        label: `${item.title}.jpg`,
        value: item.image.url,
        fileType: "JPG",
        dimensions: `${width} x ${height}`,
        width,
        height,
        ...exifData,
      };
    })
  );
}

// Define the shape of the tab item
type TabItem = {
  tab: string;
  key: string;
};

// Tab List to display
const allTabList: Array<TabItem> = [
  {
    tab: "Landmarks",
    key: "landmarkAnnotations",
  },
  {
    tab: "Objects",
    key: "localizedObjectAnnotations",
  },
  {
    tab: "Faces",
    key: "faceAnnotations",
  },
  {
    tab: "Labels",
    key: "labelAnnotations",
  },
  {
    tab: "Colors",
    key: "imagePropertiesAnnotation",
  },
  {
    tab: "Logo",
    key: "logoAnnotations",
  },
];

// Define the shape of the data returned by the fetchImageDetails function
interface FetchImageDetailsPayload {
  imageUrl: string;
  imageAnalyticsInsight: any;
  availableFeatures: Array<{
    tab: string;
    key: string;
  }>;
}

// Fetch image analytics data using google cloud vision
export const fetchImageDetails = createAsyncThunk<
  FetchImageDetailsPayload,
  string
>("image/fetchImageDetails", async (imageUrl) => {
  // Request URL for the Google Vision API
  const requestUrl = `https://vision.googleapis.com/v1/images:annotate?key=${GOOGLE_API_KEY}`;

  // Define the features to request from the API
  const features = [
    "LABEL_DETECTION",
    "FACE_DETECTION",
    "LANDMARK_DETECTION",
    "LOGO_DETECTION",
    "IMAGE_PROPERTIES",
    "OBJECT_LOCALIZATION",
  ].map((type) => ({ type, maxResults: 70 }));

  // Define the request data to send to the API
  const requestData = {
    requests: [
      {
        image: {
          source: {
            imageUri: imageUrl,
          },
        },
        features,
      },
    ],
  };

  // Send the request to the API and parse the response
  const response = await fetch(requestUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestData),
  });
  const data = await response.json();

  // Extract the relevant data from the response
  const imageAnalyticsInsight = data.responses[0];
  const availableFeatures = allTabList.filter(
    (tab) => imageAnalyticsInsight[tab.key]
  );

  // Return the extracted data
  return { imageUrl, imageAnalyticsInsight, availableFeatures };
});

// Define the imageSlice using createSlice from Redux Toolkit
const imageSlice = createSlice({
  name: "image",
  initialState,
  reducers: {
    // Define the switchTab action to update the activeTab state
    switchTab: (state, action) => {
      state.activeTab = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle the fulfilled state of the fetchPanoramaImages async action
      .addCase(fetchPanoramaImages.fulfilled, (state, action) => {
        state.panoramaImages = action.payload;
        state.isLoading = false;
      })
      // Handle the rejected state of the fetchPanoramaImages async action
      .addCase(fetchPanoramaImages.rejected, (state, action) => {
        console.error(action.error.message);
        state.isLoading = false;
      })
      // Handle the pending state of the fetchImageDetails async action
      .addCase(fetchImageDetails.pending, (state, action) => {
        state.isLoading = true;
      })
      // Handle the fulfilled state of the fetchImageDetails async action
      .addCase(fetchImageDetails.fulfilled, (state, action) => {
        state.imageDetails = action.payload.imageAnalyticsInsight;
        state.imageUrl = action.payload.imageUrl;
        state.imageAvailableFeatures = action.payload.availableFeatures;
        state.activeTab = action.payload.availableFeatures[0].key;
        state.isLoading = false;
      })
      // Handle the rejected state of the fetchImageDetails async action
      .addCase(fetchImageDetails.rejected, (state, action) => {
        console.error(action.error.message);
        state.isLoading = false;
      });
  },
});

// Export the switchTab action creator
export const { switchTab } = imageSlice.actions;

// Export the imageSlice reducer
export default imageSlice.reducer;
