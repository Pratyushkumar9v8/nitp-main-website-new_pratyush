"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import "../../components/Home/styles/Details.css";
import { Calendar, MapPin, Download, ExternalLink } from "lucide-react";

const Eventcard = ({
  detail,
  time,
  attachments,
  location,
  event_link,
  doclink,
}) => {
  const safeParseJSON = (data, fallback) => {
    try {
      return JSON.parse(data);
    } catch {
      return fallback;
    }
  };

  // ✅ Fix attachments parsing
  const parsedAttachments =
    typeof attachments === "string"
      ? safeParseJSON(attachments, [])
      : attachments || [];

  // ✅ Fix "null" string issue
  const parsedEventLink =
    event_link && event_link !== "null"
      ? safeParseJSON(event_link, null)
      : null;

  return (
    <div className="group/item rounded-lg p-3 transition-all hover:bg-purple-50 border border-gray-100 mb-4">
      <p className="mb-3 text-sm text-gray-700">{detail}</p>

      <div className="mb-2 flex items-center gap-2 text-sm text-gray-500">
        <Calendar className="h-4 w-4" />
        <span>{time}</span>
      </div>

      <div className="mb-3 flex items-center gap-2 text-sm text-gray-500">
        <MapPin className="h-4 w-4" />
        <span>{location}</span>
      </div>

      {/* Attachments */}
      {parsedAttachments.length > 0 && (
        <div className="flex flex-col gap-2 mb-3">
          {parsedAttachments.map((attachment, index) => (
            <a
              key={index}
              href={attachment.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-purple-600 hover:text-purple-700"
            >
              <Download className="h-4 w-4" />
              {attachment.caption || "Event Attachment"}
            </a>
          ))}
        </div>
      )}

      {/* Links */}
      <div className="flex flex-col gap-2">
        {doclink && (
          <a
            href={doclink.trim()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-purple-600 hover:text-purple-700"
          >
            <ExternalLink className="h-4 w-4" />
            Event Registration
          </a>
        )}

        {parsedEventLink?.url && (
          <a
            href={parsedEventLink.url.trim()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-purple-600 hover:text-purple-700"
          >
            <ExternalLink className="h-4 w-4" />
            Event Link
          </a>
        )}
      </div>
    </div>
  );
};

const Page = () => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);

  // ✅ Pagination
  const [page, setPage] = useState(1);
  const limit = 10;
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventsUrl = `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/events?type=active&page=${page}&limit=${limit}`;

        const response = await axios.get(eventsUrl);
        const result = response.data;

        // ✅ Sort correctly using result.data
        const sortedEvents = (result.data || []).sort((a, b) => {
          const dateA = new Date(parseInt(a.updatedAt));
          const dateB = new Date(parseInt(b.updatedAt));

          if (isNaN(dateA.getTime()) && isNaN(dateB.getTime())) return 0;
          if (isNaN(dateA.getTime())) return 1;
          if (isNaN(dateB.getTime())) return -1;

          return dateB - dateA;
        });

        setEvents(sortedEvents);
        setTotalPages(result.totalPages || 1);
        setIsLoading(false);
      } catch (e) {
        console.error("Error fetching Events:", e);
        setIsLoading(false);
        setFetchError(true);
      }
    };

    fetchEvents();
  }, [page]);

  return (
    <div>
      <div className="p-5 md:p-10 md:pl-28 md:pr-28">
        <div className="text-2xl text-center pb-7 md:pb-10 text-red-950 font-bold">
          <h2>Events</h2>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center">
            <div className="animate-spin h-10 w-10 border-4 border-red-400 border-t-transparent rounded-full"></div>
          </div>
        ) : fetchError ? (
          <div className="text-center text-red-500">
            <p>Sorry, failed to fetch the latest events.</p>
          </div>
        ) : (
          <>
            <div className="section-content p-0 m-0">
              {events.length === 0 ? (
                <p>No events available.</p>
              ) : (
                events.map((event, index) => {
                  const parseEventDate = (val) => {
                    if (!val) return new Date();
                    const ts =
                      typeof val === "string" ? parseInt(val) : val;
                    const d = new Date(ts);
                    return isNaN(d.getTime()) ? new Date() : d;
                  };

                  const start = parseEventDate(event.eventStartDate);
                  const end = parseEventDate(event.eventEndDate);

                  const format = (d) =>
                    `${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()}`;

                  return (
                    <Eventcard
                      key={index}
                      detail={event.title}
                      time={`${format(start)} - ${format(end)}`}
                      attachments={event.attachments}
                      location={event.venue}
                      event_link={event.event_link}
                      doclink={event.doclink}
                    />
                  );
                })
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

export default Page;