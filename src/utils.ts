export const request = async (url: string) => {
  let response;

  try {
    response = await fetch(url, {
      headers: {
        "content-type": "application/json"
      }
    });
    return await response.json();
  } catch (e) {
    return null;
  }
}

export const getFilename = (url: URL) => {
  const parts: string[] = url.pathname.split("/");
  return parts[parts.length - 1];
}
