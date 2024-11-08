import { Pinecone } from "@pinecone-database/pinecone";
import { HfInference } from "@huggingface/inference";

//import { pipeline } from "@xenova/transformers";

const hf = new HfInference(process.env.HUGGINGFACE_TOKEN);

export async function queryPineconeVectorStore(
  client: Pinecone,
  indexName: string,
  namespace: string,
  searchQuery: string
): Promise<string> {
  const hfOutput = await hf.featureExtraction({
    model: "mixedbread-ai/mxbai-embed-large-v1",
    inputs: searchQuery,
  });

  console.log(hfOutput);
  const queryEmbedding = Array.from(hfOutput);

  const index = client.Index(indexName);
  const queryResponse = await index.namespace(namespace).query({
    topK: 5,
    vector: queryEmbedding as any,
    includeMetadata: true,
    includeValues: false,
  });
  //console.log(queryResponse);

  if (queryResponse.matches.length > 0) {
    const concatRetrievals = queryResponse.matches
      .map((match, idx) => {
        return `\n Findings include ${idx + 1}: \n ${match.metadata?.chunk}`;
      })
      .join(`\n\n`);
    console.log(concatRetrievals);
    return concatRetrievals;
  } else {
    return "<no_match>";
  }
}
// export async function queryPineconeVectorStore(
//   client: Pinecone,
//   indexName: string,
//   nameSpace: string,
//   docs: Document[],
//   searchQuery: string,
//   progressCallback: (filename: string, totalChuncks: number, chunksUpserted: number, isComplete: boolean)
// ) {
//   // const modelname = "mixedbread-ai/mxbai-embed-large-v1";
//   // const extractor = await pipeline("feature-extraction", modelname, {
//   //   quantized: false
//   // });
//   // console.log(extractor);
//   //return "";
// }
