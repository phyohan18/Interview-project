import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchImageData } from "../lib/sanityClient";
import exifr from "exifr";

const initialState = {
  panoramaImages: [],
  imageDetails: [],
  imageUrl:null,
  imageAnalyticsInsight:null,
  cardTab: null,
  isLoading: true,
};

//Fetch Panorama Images from the Sanity.io Server
export const fetchPanoramaImages = createAsyncThunk(
  "image/fetchPanoramaImages",
  async () => {
    const imageData = await fetchImageData();
    const processedImages = await processImageData(imageData);
    return processedImages;
  }
);

// Extract Metadata using Exifr
async function processImageData(imageData) {
  const processedImages = await Promise.all(
    imageData.map(async (item, index) => {
      const { width, height } = item.image.metadata.dimensions;
      const exifData = await exifr.parse(`/panorama/${item.title}.jpg`);
      return {
        key: index + 1,
        fileName: item.title,
        fileURL: item.image.url,
        label: item.title + ".jpg",
        value: item.image.url,
        fileType: "JPG",
        dimensions: `${width} x ${height}`,
        width,
        height,
        ...exifData,
      };
    })
  );
  return processedImages;
}

// Tab List to display
const allTabList = [
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

export const fetchImageDetails = createAsyncThunk(
  "image/fetchImageDetails",
  async (imageUrl) => {
    const apiKey = "AIzaSyD-fxP3MVBZnFGdpRiebKHwf65QSPvkbbc";
    const requestUrl = `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`;
    const requestData = {
      requests: [
        {
          image: {
            source: {
              imageUri: imageUrl,
            },
          },
          features: [
            {
              type: "LABEL_DETECTION",
              maxResults: 70,
            },
            {
              type: "FACE_DETECTION",
              maxResults: 70,
            },
            {
              type: "LANDMARK_DETECTION",
              maxResults: 70,
            },
            {
              type: "LOGO_DETECTION",
              maxResults: 70,
            },
            {
              type: "IMAGE_PROPERTIES",
            },
            {
              type: "OBJECT_LOCALIZATION",
              maxResults: 70,
            },
          ],
        },
      ],
    };
    const response = await fetch(requestUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    });
    const data = await response.json();
    const imageAnalyticsInsight = data.responses[0];

    // Show only available features
    const availableFeatures = allTabList.filter((tab) => imageAnalyticsInsight[tab.key]);

    return { imageUrl, imageAnalyticsInsight , availableFeatures };
  }
);

const imageSlice = createSlice({
  name: "image",
  initialState,
  reducers: {
    switchTab: (state, action) => {
      state.cardTab = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPanoramaImages.fulfilled, (state, action) => {
        state.panoramaImages = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchPanoramaImages.rejected, (state, action) => {
        console.error(action.error.message);
        state.isLoading = false;
      })
      .addCase(fetchImageDetails.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(fetchImageDetails.fulfilled, (state, action) => {
        state.imageDetails = action.payload;
        state.imageUrl = action.payload.imageUrl;
        state.cardTab = action.payload.availableFeatures[0].key;
        state.isLoading = false;
      })
      .addCase(fetchImageDetails.rejected, (state, action) => {
        console.error(action.error.message);
        state.isLoading = false;
      });
  },
});

export const { switchTab } = imageSlice.actions;

export default imageSlice.reducer;
