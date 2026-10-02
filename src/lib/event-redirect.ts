export const EVENT_DESTINATION = "https://app.tokenable.io/event";

function applySearchParams(
  destination: URL,
  params: URLSearchParams | Record<string, string | string[] | undefined>,
): URL {
  if (params instanceof URLSearchParams) {
    params.forEach((value, key) => {
      destination.searchParams.set(key, value);
    });
    return destination;
  }

  for (const [key, value] of Object.entries(params)) {
    if (typeof value === "string") {
      destination.searchParams.set(key, value);
    } else if (Array.isArray(value)) {
      for (const item of value) {
        destination.searchParams.append(key, item);
      }
    }
  }
  return destination;
}

/** Copy incoming query params onto the event URL (UTM, QR extras, etc.). */
export function eventRedirectUrl(
  requestUrlOrParams: string | Record<string, string | string[] | undefined>,
): URL {
  const destination = new URL(EVENT_DESTINATION);
  if (typeof requestUrlOrParams === "string") {
    return applySearchParams(destination, new URL(requestUrlOrParams).searchParams);
  }
  return applySearchParams(destination, requestUrlOrParams);
}
