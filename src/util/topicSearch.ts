import { meiliIndex } from "./meiliClient.js";

// Adjust fields to what your t-topic type actually has
export type TopicHit = {
    id: number;
    title?: string;
    name?: string;
    slug?: string;
    description?: string;
};

export async function searchTopics(
  query: string,
  routeName: string ,
): Promise<TopicHit[]> {
  const q = query.trim();

  const options: any = {
    limit: 20,
    attributesToRetrieve: ["name", "id", "slug", "title"],
  };

  let topicIndex = meiliIndex(routeName)
  const result = await topicIndex.search<TopicHit>(q || "", options);

  return result.hits;
}

