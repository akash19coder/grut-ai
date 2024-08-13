import "cheerio";
import { NextResponse } from "next/server";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { TaskType } from "@google/generative-ai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { pull } from "langchain/hub";
import { PromptTemplate } from "@langchain/core/prompts";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";

export async function POST(request) {
  const res = await request.json();
  console.log(res);
  const llm = new ChatGoogleGenerativeAI({
    model: "gemini-1.5-flash",
    apiKey: "AIzaSyBoGvHD6oGYOtGxJ8Ny-OeyMnMmncjyPdY",
    tempareture: 0,
  });

  const embeddings = new GoogleGenerativeAIEmbeddings({
    model: "text-embedding-004", // 768 dimensions
    taskType: TaskType.RETRIEVAL_DOCUMENT,
    title: "Document title",
  });

  const parser = new StringOutputParser();

  // const pTagSelector = "p";
  // const loader = new CheerioWebBaseLoader(
  //   "https://docs.google.com/document/d/1y0ffpeJDEO1qH15k-vv7-_IjAvk-e17HxuWafuVIKT4/edit?usp=sharing"
  // );

  const nike10kPdfPath = "/public/grut.pdf";
  const loader = new PDFLoader(nike10kPdfPath);

  const docs = await loader.load();

  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });
  const allSplits = await textSplitter.splitDocuments(docs);

  const vectorStore = await MemoryVectorStore.fromDocuments(
    allSplits,
    embeddings
  );

  const retriever = vectorStore.asRetriever({ k: 6, searchType: "similarity" });

  const template = `You are trained on the following pieces of context which is Grut's daily journel.Use the following pieces of context to answer the question at the end.
Whenever you are referring to the user, use Grut's instead.If you don't know the answer, just say that you don't know, don't try to make up an answer.
Use three sentences maximum and keep the answer as concise as possible. Be straight forward and lil funny when you are pointed on being straightforward.
Always say "thanks for asking!" at the end of the answer.

{context}

Question: {question}

Helpful Answer:`;

  const customRagPrompt = PromptTemplate.fromTemplate(template);
  const prompt = await pull("rlm/rag-prompt");

  const ragChain = await createStuffDocumentsChain({
    llm,
    prompt: customRagPrompt,
    outputParser: new StringOutputParser(),
  });

  const retrievedDocs = await retriever.invoke(res.text);
  const ragR = await ragChain.invoke({
    question: res.text,
    context: retrievedDocs,
  });
  const parserR = await parser.invoke(ragR);

  return NextResponse.json({ type: "assistant", text: parserR });
}
