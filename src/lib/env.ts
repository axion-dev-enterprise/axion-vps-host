const DEFAULT_API_BASE_URL = "http://localhost:3001";

export function getApiBaseUrl() {
  if (typeof window !== "undefined") {
    return "";
  }

  return process.env.PONTOTECC_API_BASE_URL || DEFAULT_API_BASE_URL;
}

export function getIsMockApi() {
  // Default to mock if not explicitly disabled or if we're in a situation where the backend is not expected
  return process.env.MOCK_API !== "false";
}
