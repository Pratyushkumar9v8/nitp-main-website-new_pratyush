// "use client";
// import React, { useEffect, useState } from "react";
// import { ChevronDown, ChevronUp } from "lucide-react";

// const CheConferencePage = () => {
//   const [publications, setPublications] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [openYears, setOpenYears] = useState({}); // dropdown open/close tracking

//   const fetchPublications = async () => {
//     setIsLoading(true);
//     try {
//       // API endpoint from the Chemistry file
//       const response = await fetch(
//         `https://admin.nitp.ac.in/api/publications?type=all`
//       );
//       const data = await response.json();

//       // Group publications by year
//       const groupedByYear = data.reduce((acc, publication) => {
//         if (!publication.conference_year) return acc; // Skip if year is missing or undefined
//         const year = publication.conference_year;
//         if (!acc[year]) {
//           acc[year] = [];
//         }
//         acc[year].push(publication);
//         return acc;
//       }, {});

//       setPublications(groupedByYear);
//       setError(null);
//     } catch (error) {
//       setError("Failed to fetch publication data");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchPublications();
//   }, []);

//   // UI functionality from the CSE file
//   const toggleYear = (year) => {
//     setOpenYears((prev) => ({ ...prev, [year]: !prev[year] }));
//   };

//   // UI structure from the CSE file
//   return (
//     <div className="min-h-screen bg-white bg-opacity-50">
//       <div className="mx-auto px-4 py-8 max-w-6xl">
//         <h1 className="text-2xl md:text-3xl font-bold mb-8 text-red-700 text-center">
//           Conference Publications
//         </h1>
//         {isLoading ? (
//           <div className="flex justify-center items-center">
//             <svg
//               version="1.1"
//               id="L1"
//               height="150px"
//               width="150px"
//               viewBox="0 0 100 100"
//               enableBackground="new 0 0 100 100"
//             >
//               <circle
//                 fill="none"
//                 stroke="#f87171"
//                 strokeWidth="6"
//                 strokeMiterlimit="15"
//                 strokeDasharray="14.2472,14.2472"
//                 cx="50"
//                 cy="50"
//                 r="47"
//               >
//                 <animateTransform
//                   attributeName="transform"
//                   attributeType="XML"
//                   type="rotate"
//                   dur="5s"
//                   from="0 50 50"
//                   to="360 50 50"
//                   repeatCount="indefinite"
//                 />
//               </circle>
//               <circle
//                 fill="none"
//                 stroke="#f87171"
//                 strokeWidth="1"
//                 strokeMiterlimit="10"
//                 strokeDasharray="10,10"
//                 cx="50"
//                 cy="50"
//                 r="39"
//               >
//                 <animateTransform
//                   attributeName="transform"
//                   attributeType="XML"
//                   type="rotate"
//                   dur="5s"
//                   from="0 50 50"
//                   to="-360 50 50"
//                   repeatCount="indefinite"
//                 />
//               </circle>
//             </svg>
//           </div>
//         ) : error ? (
//           <div className="text-center text-red-500">
//             <p>{error}</p>
//             <p>Please try refreshing the page</p>
//           </div>
//         ) : (
//           Object.keys(publications)
//             .sort((a, b) => b - a) // Sort years in descending order
//             .map((year) => (
//               <div
//                 key={year}
//                 className="mb-6 border border-gray-300 rounded-lg shadow-md bg-blue-100"
//               >
//                 <button
//                   onClick={() => toggleYear(year)}
//                   className="w-full px-4 py-3 bg-red-200 text-left text-lg font-bold text-red-700 flex justify-between items-center hover:bg-red-300 transition"
//                 >
//                   Publications in {year} ({publications[year].length})
//                   {openYears[year] ? <ChevronUp /> : <ChevronDown />}
//                 </button>

//                 {openYears[year] && (
//                   <div className="overflow-y-auto max-h-100">
//                     <ul className="p-4 space-y-4">
//                       {publications[year].map((paper, index) => (
//                         <li
//                           key={index}
//                           className="p-4 border border-gray-300 bg-white rounded-lg shadow-md hover:shadow-lg transition-transform duration-300"
//                         >
//                           <p className="text-gray-800">
//                             <span className="font-semibold">{paper.authors}</span>,{" "}
//                             <span className="font-semibold text-blue-700">
//                               "{paper.title}"
//                             </span>
//                             ,
//                             <span className="text-gray-700 text-lg font-bold">
//                               {" "}
//                               {paper.conference_name}
//                             </span>
//                             <span className="text-gray-800 font-semibold">
//                               {" "}
//                               Location: {paper.location}
//                             </span>
//                             <span className="text-gray-700">
//                               {" "}
//                               ({paper.conference_year})
//                             </span>
//                           </p>
//                           {paper.doi && (
//                             <p className="text-blue-600 underline">
//                               <a
//                                 href={paper.doi}
//                                 target="_blank"
//                                 rel="noopener noreferrer"
//                               >
//                                 DOI Link
//                               </a>
//                             </p>
//                           )}
//                         </li>
//                       ))}
//                     </ul>
//                   </div>
//                 )}
//               </div>
//             ))
//         )}
//       </div>
//     </div>
//   );
// };

// export default CheConferencePage;

"use client";
import React, { useEffect, useState } from "react";

const CheConferencePage = () => {
  const [publications, setPublications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Pagination state
  const [page, setPage] = useState(1);
  const limit = 10;
  const [totalPages, setTotalPages] = useState(1);

  const fetchPublications = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/conference?type=che&page=${page}&limit=${limit}`
      );

      const result = await response.json();

      // ✅ FIX: correct key is conference_data
      setPublications(result?.conference_data || []);
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
          Conference Publications
        </h1>

        {error && (
          <p className="text-center text-red-500 mb-4">{error}</p>
        )}

        {/* ✅ Loading */}
        {isLoading ? (
          <div className="flex justify-center">
            <div className="animate-spin h-10 w-10 border-4 border-red-400 border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <>
            {/* ✅ Flat List UI (clean like journal page) */}
            <div className="space-y-5">
              {publications.length === 0 ? (
                <p className="text-center">No conference data found.</p>
              ) : (
                publications.map((paper, index) => (
                  <div
                    key={index}
                    className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition"
                  >
                    {/* Title */}
                    <h2 className="text-lg font-semibold text-red-800 leading-snug">
                      {paper.title}
                    </h2>

                    {/* Authors */}
                    <p className="text-sm text-gray-700 mt-1">
                      {paper.authors}
                    </p>

                    {/* Conference Info */}
                    <div className="text-sm text-gray-600 mt-2 flex flex-wrap gap-2">
                      {paper.conference_name && (
                        <span className="font-medium">
                          {paper.conference_name}
                        </span>
                      )}

                      {paper.location && (
                        <span className="bg-gray-100 px-2 py-0.5 rounded">
                          {paper.location}
                        </span>
                      )}

                      {paper.conference_type && (
                        <span>{paper.conference_type}</span>
                      )}

                      {paper.conference_year && (
                        <span>{paper.conference_year}</span>
                      )}
                    </div>

                    {/* DOI */}
                    {paper.doi && (
                      <a
                        href={paper.doi}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mt-3 text-sm font-medium text-white bg-red-600 px-4 py-1.5 rounded hover:bg-red-700 transition"
                      >
                        View DOI
                      </a>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* ✅ Pagination */}
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
          </>
        )}
      </div>
    </div>
  );
};

export default CheConferencePage;