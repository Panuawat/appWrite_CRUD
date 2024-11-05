"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CreatePage() {
  const [formData, setFormData] = useState({ term: "", interpretation: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const route = useRouter();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    console.log(formData);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    if (!formData.term || !formData.interpretation) {
      setError("Please fill in all fields");
      setIsLoading(false); // Ensure this stops the loading state
      return;
    }
    setError(null);
    try {
      const response = await fetch("/api/interpretation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create interpretation");
      }

      setFormData({ term: "", interpretation: "" }); // Clear form fields
      route.push("/");
    } catch (error) {
      console.error("Error creating interpretation:", error);
      setError("Failed to create interpretation");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1 className=" text-2xl font-bold my-8">Create Page</h1>
      <form className="flex gap-3 flex-col" onSubmit={handleSubmit}>
        <input
          type="text"
          name="term"
          value={formData.term}
          placeholder="Term"
          className="py-1 px-4 border rounded-md text-black"
          onChange={handleInputChange}
        />
        <textarea
          name="interpretation"
          placeholder="interpretation..."
          value={formData.interpretation}
          className=" text-black py-1 px-4 border rounded-md resize-none"
          cols={30}
          rows={10}
          onChange={handleInputChange}
        ></textarea>
        <button
          className="bg-orange-500 text-white mt-5 w-full rounded-md py-2 font-bold"
          disabled={isLoading}
          type="submit"
        >
          {isLoading ? "Loading..." : "Add"}
        </button>
      </form>

      {error && <p className="text-red-500 py-4">{error}</p>}
    </div>
  );
}
