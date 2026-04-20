"use client";
import React, { useEffect, useState } from "react";
import Spinner from "../../../components/Spinner.js";

const ECEProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // pagination
  const [page, setPage] = useState(1);
  const limit = 10;
  const [totalPages, setTotalPages] = useState(1);

  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/project?type=ece&page=${page}&limit=${limit}`
      );

      const result = await res.json();

      setProjects(result?.data || []);
      setTotalPages(result?.totalPages || 1);

      setError(null);
    } catch (err) {
      setError("Failed to fetch project data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [page]);

  return (
    <div className="min-h-screen bg-white bg-opacity-50">
      <div className="mx-auto px-4 py-8 max-w-6xl">

        <h1 className="text-2xl md:text-3xl font-bold mb-8 text-red-700 text-center">
          Projects
        </h1>

        {isLoading ? (
          <div className="flex justify-center items-center">
            <Spinner />
          </div>
        ) : error ? (
          <div className="text-center text-red-500">
            <p>{error}</p>
          </div>
        ) : (
          <>
            {/* ✅ FLAT LIST (Conference-style cards) */}
            <div className="space-y-5">
              {projects.length === 0 ? (
                <p className="text-center">No projects found.</p>
              ) : (
                projects.map((p) => (
                  <div
                    key={p.id}
                    className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition"
                  >
                    {/* Title */}
                    <h2 className="text-lg font-semibold text-red-700 leading-snug">
                      {p.project_title}
                    </h2>

                    {/* PI + Role */}
                    <p className="text-sm text-gray-700 mt-1">
                      <span className="font-medium">{p.name}</span>
                      {p.role && (
                        <span className="text-gray-500">
                          {" "}({p.role})
                        </span>
                      )}
                    </p>

                    {/* Meta row */}
                    <div className="text-sm text-gray-600 mt-2 flex flex-wrap gap-2">
                      {p.funding_agency && (
                        <span className="font-medium">
                          {p.funding_agency}
                        </span>
                      )}

                      {p.project_type && (
                        <span className="bg-gray-100 px-2 py-0.5 rounded">
                          {p.project_type}
                        </span>
                      )}

                      {p.status && (
                        <span
                          className={`inline-block text-xs px-2 py-1 rounded mt-2 w-fit font-medium ${
                            p.status.toLowerCase() === "completed"
                              ? "bg-green-100 text-green-700"
                              : p.status.toLowerCase() === "ongoing"
                              ? "bg-red-100 text-red-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {p.status}
                        </span>
                      )}

                      {p.start_date && (
                        <span>
                          {p.start_date}
                        </span>
                      )}
                    </div>

                    {/* Investigators */}
                    {p.investigators && (
                      <p className="text-sm text-gray-600 mt-2">
                        <span className="font-medium">Investigators:</span>{" "}
                        {p.investigators}
                      </p>
                    )}

                    {/* Budget */}
                    {p.financial_outlay && (
                      <p className="text-sm font-bold text-gray-900 mt-1">
                        <span className="font-medium">Budget:</span>{" "}
                        ₹{p.financial_outlay}
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* ✅ Pagination (same as conference style) */}
            <div className="flex justify-center items-center gap-6 mt-10">
              <button
                onClick={() => setPage((p) => p - 1)}
                disabled={page === 1 || isLoading}
                className="px-5 py-2 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 disabled:opacity-40"
              >
                ← Previous
              </button>

              <span className="text-sm font-medium text-gray-700">
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

export default ECEProjectsPage;