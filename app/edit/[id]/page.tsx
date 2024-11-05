"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation"; // Import for extracting params

export default function EditPage() {
  const [formData, setFormData] = useState({ term: "", interpretation: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const params = useParams(); // Extract `id` from route params

  const route = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      if (!params.id) return; // Ensure `id` exists

      try {
        const res = await fetch(`/api/interpretation/${params.id}`);

        if (!res.ok) {
          throw new Error("Failed to fetch data");
        }

        const data = await res.json();
        setFormData({ term: data.term, interpretation: data.interpretation });
      } catch (error) {
        setError("Failed to fetch data");
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [params.id]); // Add `params.id` as a dependency

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/interpretation/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error("Failed to update data");
      }

      route.push("/");


      // Redirect or handle success
    } catch (error) {
      setError("Failed to update data");
      console.error("Error updating data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold my-8">Update Page</h1>
      {error && <p className="text-red-500 py-4">{error}</p>}
      <form className="flex gap-3 flex-col" onSubmit={handleSubmit}>
        <input
          type="text"
          name="term"
          placeholder="Term"
          className="py-1 px-4 border rounded-md text-black"
          value={formData.term}
          onChange={handleInputChange}
        />
        <textarea
          name="interpretation" // Corrected the `name` attribute
          placeholder="Interpretation..."
          className=" text-black py-1 px-4 border rounded-md resize-none"
          cols={30}
          rows={10}
          value={formData.interpretation}
          onChange={handleInputChange}
        ></textarea>

        <button
          type="submit"
          className="bg-orange-500 text-white mt-5 w-full rounded-md py-2 font-bold"
        >
          {isLoading ? "Loading..." : "Update"}
        </button>
      </form>

      {error && <p className="text-red-500 py-4">{error}</p>}
    </div>
  );
}
