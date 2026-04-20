// "use client";
// import React, { useEffect, useState } from "react";
// import { ChevronDown, ChevronUp } from "lucide-react";

// const ArchiPatentsPage = () => {
//   const [publications, setPublications] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [openYears, setOpenYears] = useState({}); // dropdown open/close tracking

//   // format Date
//   function formatISODate(isoDateStr) {
//     const date = new Date(isoDateStr);

//     const day = String(date.getUTCDate()).padStart(2, '0');
//     const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Months are 0-based
//     const year = date.getUTCFullYear();

//     return `${day}-${month}-${year}`;
//   }

//   const fetchPublications = async () => {
//     setIsLoading(true);
//     try {
//       const response = await fetch(
//         `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/patent?type=arch`
//       );
//       const data = await response.json();

//       // console.log(data);

//       // Group publications by year
//       const groupedByYear = data.reduce((acc, publication) => {
//         if (!publication.publication_date) return acc; // Skip if patent_date is missing

//         const year = new Date(publication.publication_date).getFullYear();
//         if (isNaN(year)) return acc; // Skip if year is NaN (invalid date)

//         if (!acc[year]) {
//           acc[year] = [];
//         }
//         acc[year].push(publication);

//         return acc;
//       }, {});

//       setPublications(groupedByYear);
//       // console.log(groupedByYear);
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
//           Patents
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
//                 className="mb-6 border border-gray-300 rounded-lg shadow-md bg-white"
//               >
//                 <button
//                   onClick={() => toggleYear(year)}
//                   className="w-full px-4 py-3 bg-red-100 text-left text-lg font-bold text-red-700 flex justify-between items-center hover:bg-red-200 transition"
//                 >
//                   Patents in {year} ({publications[year].length})
//                   {openYears[year] ? <ChevronUp /> : <ChevronDown />}
//                 </button>

//                 {openYears[year] && (
//                   <div className="overflow-y-auto max-h-100">
//                     <ul className="p-4 space-y-4">
//                       {publications[year].map((patent, index) => (
//                         <li
//                           key={index}
//                           className="p-4 border border-gray-300 bg-white rounded-lg shadow-md hover:shadow-lg transition-transform duration-300"
//                         >
//                           {/* patent Title */}
//                           <h3 className="text-lg font-semibold text-blue-800">
//                             {patent.title}
//                           </h3>

//                           {patent.inventors && (
//                             <p className="text-gray-600">
//                               Inventors:{" "}
//                               <span className="text-black">
//                                 {patent.inventors}
//                               </span>
//                             </p>
//                           )}

//                           {patent.registration_date && (
//                             <p className="text-gray-600">
//                               Registration Date: {" "}
//                               {formatISODate(patent.registration_date)}
//                             </p>
//                           )}

//                           {patent.publication_date && (
//                             <p className="text-gray-600">
//                               Publication Date: {" "}
//                               {formatISODate(patent.publication_date)}
//                             </p>
//                           )}

//                           {patent.grant_no && (
//                             <p className="text-gray-600">
//                               Patent No:{" "}
//                               <span className="text-black">
//                                 {patent.grant_no}
//                               </span>
//                             </p>
//                           )}

//                           {patent.grant_date && (
//                             <p className="text-gray-600">
//                               Grant Date: {" "}
//                               {formatISODate(patent.grant_date)}
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

// export default ArchiPatentsPage;
"use client";
import React, { useEffect, useState } from "react";

const ArchiPatentsPage = () => {
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
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/patent?type=arch&page=${page}&limit=${limit}`
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

export default ArchiPatentsPage;