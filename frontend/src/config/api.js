export const API_BASE_URL = (
  import.meta.env.VITE_API_URL || "https://food-delivery-eeef.onrender.com"
).replace(/\/$/, "")

export const readJsonResponse = async (response) => {
  const contentType = response.headers.get("content-type") || ""

  if (!contentType.includes("application/json")) {
    throw new Error(`API did not return JSON. Check that the backend is running at ${API_BASE_URL}.`)
  }

  return response.json()
}
