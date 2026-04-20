export function extractApiArray(response) {
  if (!response) return [];
  const payload = response.data ?? response;

  if (Array.isArray(payload)) {
    return payload;
  }

  if (payload?.data && Array.isArray(payload.data)) {
    return payload.data;
  }

  return [];
}
