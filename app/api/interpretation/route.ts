import client from "@/lib/appwrite_client";
import { Databases, ID, Query } from "appwrite";
import { NextResponse } from "next/server";

const db = new Databases(client);

async function createInterpretation(data: {
  term: string;
  interpretation: string;
}) {
  try {
    const res = await db.createDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
      "6724b12900155470416f",
      ID.unique(),
      data
    );

    return res;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to create interpretation");
  }
}

async function getInterpretations() {
  try {
    const res = await db.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
      "6724b12900155470416f",
      [Query.orderDesc("$createdAt")]
    );

    return res.documents;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to get interpretations");
  }
}

export async function POST(req: Request) {
  try {
    const { term, interpretation } = await req.json();
    const data = {
      term,
      interpretation,
    };
    const res = await createInterpretation(data);


    return NextResponse.json({
      message: "Interpretation created successfully",
      data: res,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Failed to create interpretation" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const interpretations = await getInterpretations();

    return NextResponse.json(interpretations);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Failed to get interpretations" },
      { status: 500 }
    );
  }
}
