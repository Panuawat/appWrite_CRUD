"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";

interface IInterpretation {
  $id: string;
  term: string;
  interpretation: string;
}

const Home = () => {
  const [interpretation, setInterpretation] = useState<IInterpretation[]>([]); // Initialize as an array
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInterpretations = async () => {
      try {
        setIsLoading(true);
        const res = await fetch("/api/interpretation");
        if (!res.ok) {
          throw new Error("Failed to fetch interpretations");
        }
        const data = await res.json();

        setInterpretation(data);
      } catch (error) {
        console.error("Error fetching interpretations:", error);
        setError("Failed to fetch interpretations");
      } finally {
        setIsLoading(false);
      }
    };
    fetchInterpretations();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/interpretation/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        throw new Error("Failed to delete interpretation");
      }
      setInterpretation((prevInterpretation) =>
        prevInterpretation.filter((item) => item.$id !== id)
      );
    } catch (error) {
      console.error("Error deleting interpretation:", error);
      setError("Failed to delete interpretation");
    }
  };

  return (
    <div>
      {error && <p className="text-red-500 py-4">{error}</p>}
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        interpretation.map((item) => (
          <div
            key={item.$id}
            className="p-4 my-2 rounded-md border-b leading-8"
          >
            <h1 className="font-bold">{item.term}</h1>
            <p>
              {item.interpretation.length > 100
                ? `${item.interpretation.substring(0, 100)}...`
                : item.interpretation}
            </p>
            <div className="flex gap-4 mt-4 justify-end">
              <Link
                href={`/edit/${item.$id}`}
                className="bg-slate-200 px-4 py-2 rounded-md text-sm font-bold tracking-widest text-black"
              >
                Edit
              </Link>
              <button
                onClick={() => handleDelete(item.$id)}
                className="bg-red-500 px-4 py-2 rounded-md text-sm font-bold tracking-widest text-black"
              >
                Delete
              </button>
            </div>
          </div>
        ))
      )}
      {!isLoading && interpretation.length === 0 && (
        <p className="text-center mt-4">No interpretations available.</p>
      )}
    </div>
  );
};


export default Home;
