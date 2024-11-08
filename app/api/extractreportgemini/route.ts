import { GoogleGenerativeAI } from "@google/generative-ai";

const genAi = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAi.getGenerativeModel({
  model: "gemini-1.5-pro",
});
const prompt = `Attahced is an image of a ... Go over the report and identify . 
then summarize in teh 100 words. Have details form report including report title
##Summary: `;

export async function POST(req: Request, res: Response) {
  const { base64 } = await req.json();
  const filePart = fileToGenerativePart(base64);
  const generatedContent = await model.generateContent([prompt, filePart]);
  console.log(generatedContent);

  const reportText = generatedContent.response.text();
  return new Response(reportText, { status: 200 });
}

function fileToGenerativePart(imageData: string) {
  return {
    inlineData: {
      data: imageData.split(",")[1],
      mimeType: imageData.substring(
        imageData.indexOf(":") + 1,
        imageData.lastIndexOf(";")
      ),
    },
  };
}
