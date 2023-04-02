import { createClient, SanityClient } from "@sanity/client"; // import createClient and SanityClient from the @sanity/client package
import imageUrlBuilder from "@sanity/image-url"; // import imageUrlBuilder from the @sanity/image-url package

// define the type of the returned image data
type ImageData = {
  _id: string,
  title: string,
  image: {
    metadata: Record<string, unknown>,
    url: string,
  },
};

// create a SanityClient instance with the specified project ID, dataset, API version, and CDN usage
const sanityClient: SanityClient = createClient({
  projectId: "0u3qo37j",
  dataset: "production",
  apiVersion: "v1",
  useCdn: true,
});

// define a function that fetches image data from Sanity and returns it as an array of ImageData objects
export const fetchImageData = async (): Promise<ImageData[]> => {
  const query = `*[_type == 'images']{
      _id,
      title,
      image {
        "metadata" : asset->metadata,
        "url": asset->url
      }
    }|order(_createdAt asc)`;
  const imageData: ImageData[] = await sanityClient.fetch(query);
  return imageData;
};

// define a function that uses the imageUrlBuilder to generate a URL for the specified image source
export const urlFor = (source: string): any =>
  imageUrlBuilder(sanityClient).image(source);
