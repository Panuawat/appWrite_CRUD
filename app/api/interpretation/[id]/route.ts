import client from "@/lib/appwrite_client";
import { Databases } from "appwrite";
import { NextResponse } from "next/server";

const db = new Databases(client);

async function getInterpretations(id: string) {
    try {
      const res = await db.getDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
        "6724b12900155470416f",
        id
      );
  
      return res;
    } catch (error) {
      console.log(error);
      throw new Error("Failed to get interpretation");
    }
  }
  

async function deleteInterpretation(id: string) {
  try {
    const res = await db.deleteDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
      "6724b12900155470416f",
      id
    );
    return res;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to delete interpretation");
  }
}

async function updateInterpretation(
  id: string,
  data: { term: string; interpretation: string }
) {
  try {
    const res = await db.updateDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
      "6724b12900155470416f",
      id,
      data
    );
    return res;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to update interpretation");
  }
}

export async function GET(
    req: Request,
    { params }: { params: { id: string } }
  ) {
    try {
      const id = params.id;
      const interpretation = await getInterpretations(id);
      return NextResponse.json(interpretation);
    } catch (error) {
      return NextResponse.json(
        { message: "Failed to get interpretation" },
        { status: 500 }
      );
    }
  }
  
  export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
  ) {
    try {
      const id = params.id;
      const deleted = await deleteInterpretation(id);
      return NextResponse.json("You are delete successfully");
    } catch (error) {
      return NextResponse.json(
        { message: "Failed to delete interpretation" },
        { status: 500 }
      );
    }
  }
  
  export async function PUT(
    req: Request,
    { params }: { params: { id: string } }
  ) {
    try {
      const id = params.id;
      const interpretation = await req.json();
      await updateInterpretation(id, interpretation);

      return NextResponse.json(interpretation);
      
    } catch (error) {
      return NextResponse.json(
        { message: "Failed to update interpretation" },
        { status: 500 }
      );
    }
  }
  
