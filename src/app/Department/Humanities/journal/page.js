"use client";
import React, { useEffect, useState } from "react";

const HSSJournalPage = () => {
  const [publications, setPublications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [page, setPage] = useState(1);
  const limit = 10; 
  const [totalPages, setTotalPages] = useState(1);

  const fetchPublications = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/publications?type=hss&page=${page}&limit=${limit}`
      );

      const result = await response.json();


      setPublications(result?.data || []);
      setTotalPages(result?.totalPages || 1);

      setError(null);
    } catch (error) {
      setError("Failed to fetch publication data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPublications();
  }, [page]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto px-4 py-10 max-w-5xl">
        <h1 className="text-3xl font-bold mb-10 text-red-700 text-center">
          Journal Publications
        </h1>

        {error && (
          <p className="text-center text-red-500 mb-4">{error}</p>
        )}

        {/* ✅ Cards */}
        {isLoading ? (
          <div className="flex justify-center">
            <div className="animate-spin h-10 w-10 border-4 border-red-400 border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <div className="space-y-5">
            {publications.length === 0 ? (
              <p className="text-center">No publications found.</p>
            ) : (
              publications.map((paper, index) => (
                <div
                  key={index}
                  className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition"
                >
                  {/* Title */}
                  <h2 className="text-lg font-semibold text-red-700 leading-snug">
                    {paper.title}
                  </h2>

                  {/* Authors */}
                  <p className="text-sm text-gray-700 mt-1">
                    {paper.authors}
                  </p>

                  {/* Meta */}
                  <div className="text-sm text-gray-600 mt-2 flex flex-wrap gap-2">
                    <span className="font-medium">{paper.journal_name}</span>

                    {paper.journal_quartile && (
                      <span className="bg-gray-100 px-2 py-0.5 rounded">
                        {paper.journal_quartile}
                      </span>
                    )}

                    {paper.volume && <span>Vol: {paper.volume}</span>}

                    {paper.publication_year && (
                      <span>{paper.publication_year}</span>
                    )}
                  </div>

                  {/* DOI */}
                  {paper.doi_url && (
                    <a
                      href={paper.doi_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-3 text-sm font-medium text-white bg-red-600 px-4 py-1.5 rounded hover:bg-blue-700 transition"
                    >
                      View Paper
                    </a>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* ✅ Pagination (Visible & Clean) */}
        <div className="flex justify-center items-center gap-6 mt-10">
          <button
            onClick={() => setPage((prev) => prev - 1)}
            disabled={page === 1 || isLoading}
            className="px-5 py-2 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 disabled:opacity-40"
          >
            ← Previous
          </button>

          <span className="text-sm font-medium text-gray-700">
            Page {page} of {totalPages}
          </span>

          <button
            onClick={() => setPage((prev) => prev + 1)}
            disabled={page === totalPages || isLoading}
            className="px-5 py-2 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 disabled:opacity-40"
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
};

export default HSSJournalPage;