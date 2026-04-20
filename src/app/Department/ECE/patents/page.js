"use client";
import React, { useEffect, useState } from "react";

const ECEPatentsPage = () => {
  const [patents, setPatents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // pagination
  const [page, setPage] = useState(1);
  const limit = 10;
  const [totalPages, setTotalPages] = useState(1);

  function formatISODate(isoDateStr) {
    if (!isoDateStr) return "-";
    const date = new Date(isoDateStr);

    const day = String(date.getUTCDate()).padStart(2, "0");
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const year = date.getUTCFullYear();

    return `${day}-${month}-${year}`;
  }

  const fetchPatents = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/patent?type=ece&page=${page}&limit=${limit}`
      );

      const result = await response.json();

      setPatents(result?.data || []);
      setTotalPages(result?.totalPages || 1);

      setError(null);
    } catch (error) {
      setError("Failed to fetch patent data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPatents();
  }, [page]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto px-4 py-10 max-w-5xl">

        <h1 className="text-3xl font-bold mb-10 text-red-700 text-center">
          Patents
        </h1>

        {error && (
          <p className="text-center text-red-500 mb-4">{error}</p>
        )}

        {/* Loader */}
        {isLoading ? (
          <div className="flex justify-center">
            <div className="animate-spin h-10 w-10 border-4 border-red-400 border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <>
            {/* ✅ Patent List */}
            <div className="space-y-5">
              {patents.length === 0 ? (
                <p className="text-center">No patents found.</p>
              ) : (
                patents.map((patent) => (
                  <div
                    key={patent.id}
                    className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition"
                  >
                    {/* Title */}
                    <h2 className="text-lg font-semibold text-red-800">
                      {patent.title}
                    </h2>

                    {/* Inventors */}
                    {patent.inventors && (
                      <p className="text-sm text-gray-700 mt-1">
                        <span className="font-medium">Inventors:</span>{" "}
                        {patent.inventors}
                      </p>
                    )}

                    {/* Meta */}
                    <div className="text-sm text-gray-600 mt-2 flex flex-wrap gap-3">
                      {patent.grant_no && (
                        <span>
                          <b>Patent No:</b> {patent.grant_no}
                        </span>
                      )}

                      {patent.registration_date && (
                        <span>
                          <b>Registered:</b>{" "}
                          {formatISODate(patent.registration_date)}
                        </span>
                      )}

                      {patent.publication_date && (
                        <span>
                          <b>Published:</b>{" "}
                          {formatISODate(patent.publication_date)}
                        </span>
                      )}

                      {patent.grant_date && (
                        <span>
                          <b>Granted:</b>{" "}
                          {formatISODate(patent.grant_date)}
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* ✅ Pagination */}
            <div className="flex justify-center items-center gap-6 mt-10">
              <button
                onClick={() => setPage((p) => p - 1)}
                disabled={page === 1 || isLoading}
                className="px-5 py-2 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 disabled:opacity-40"
              >
                ← Previous
              </button>

              <span className="text-sm font-medium text-black">
                Page {page} of {totalPages}
              </span>

              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={page === totalPages || isLoading}
                className="px-5 py-2 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 disabled:opacity-40"
              >
                Next →
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ECEPatentsPage;