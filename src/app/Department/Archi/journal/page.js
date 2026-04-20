// "use client";
// import React, { useEffect, useState } from "react";
// import { ChevronDown, ChevronUp } from "lucide-react";

// const ArchiJournalPage = () => {
//   const [publications, setPublications] = useState({});
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [openYears, setOpenYears] = useState({}); // dropdown open/close tracking

//   const fetchPublications = async () => {
//     setIsLoading(true);
//     try {
//       const response = await fetch(
//         `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/publications?type=arch`
//       );
//       const data = await response.json();

//       const groupedByYear = data.reduce((acc, publication) => {
//         if (!publication.publication_year) return acc;
//         const year = publication.publication_year;
//         if (!acc[year]) acc[year] = [];
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

//   const toggleYear = (year) => {
//     setOpenYears((prev) => ({ ...prev, [year]: !prev[year] }));
//   };

//   return (
//     <div className="min-h-screen bg-white bg-opacity-50">
//       <div className="mx-auto px-4 py-8 max-w-6xl">
//         <h1 className="text-2xl md:text-3xl font-bold mb-8 text-red-700 text-center">
//           Journal Publications
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
//             .sort((a, b) => b - a)
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
//                             {paper.authors && (
//                               <span className="font-semibold">{paper.authors}</span>
//                             )}
//                             ,{" "}
//                             {paper.title && (
//                               <span className="font-semibold text-blue-700">
//                                 "{paper.title}"
//                               </span>
//                             )}
//                             ,{" "}
//                             {paper.journal_name && (
//                               <span className="text-gray-700 text-lg font-semibold">
//                                 {paper.journal_name}
//                               </span>
//                             )}{" "}
//                             {paper.journal_quartile && (
//                               <span className="text-gray-700">
//                                 ({paper.journal_quartile})
//                               </span>
//                             )}{" "}
//                             {paper.volume && (
//                               <span className="text-gray-700">
//                                 Volume: {paper.volume}
//                               </span>
//                             )}{" "}
//                             {paper.publication_year && (
//                               <span className="text-gray-700">
//                                 Year: {paper.publication_year}
//                               </span>
//                             )}
//                           </p>
//                           {paper.doi_url && (
//                             <p className="text-blue-600 underline">
//                               <a
//                                 href={paper.doi_url}
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

// export default ArchiJournalPage;
"use client";
import React, { useEffect, useState } from "react";

const ArchiJournalPage = () => {
  const [publications, setPublications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [page, setPage] = useState(1);
  const limit = 10; // ✅ fixed, no selector
  const [totalPages, setTotalPages] = useState(1);

  const fetchPublications = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/publications?type=arch&page=${page}&limit=${limit}`
      );

      const result = await response.json();

      // ✅ Replace data (correct for pagination)
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

export default ArchiJournalPage;