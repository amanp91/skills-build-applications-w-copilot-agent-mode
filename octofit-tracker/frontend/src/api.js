const codespaceName = import.meta.env.VITE_CODESPACE_NAME;

export const apiBaseUrl = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev`
  : import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const normalizeCollection = (payload) => {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.results)) {
    return payload.results;
  }

  if (Array.isArray(payload?.data)) {
    return payload.data;
  }

  if (Array.isArray(payload?.items)) {
    return payload.items;
  }

  return [];
};

export async function fetchResource(resource) {
  const endpoint = resource.startsWith('/api/') ? resource : `/api/${resource}/`;
  const response = await fetch(`${apiBaseUrl}${endpoint}`);
  if (!response.ok) {
    throw new Error(`Failed to load ${resource}`);
  }

  return normalizeCollection(await response.json());
}
