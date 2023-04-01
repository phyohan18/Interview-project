import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";

const sanityClient = createClient({
  projectId: "0u3qo37j",
  dataset: "production",
  apiVersion: "v1",
  useCdn: true,
});

export const fetchImageData = async () => {
  const query = `*[_type == 'images']{
      _id,
      title,
      image {
        "metadata" : asset->metadata,
        "url": asset->url
      }
    }|order(_createdAt asc)`;
  const imageData = await sanityClient.fetch(query);
  return imageData;
};

export const urlFor = (source) => imageUrlBuilder(sanityClient).image(source);
