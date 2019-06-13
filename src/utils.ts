import urljoin from "url-join";
import { Config } from "./Config";
import { Clip } from "./interfaces/Clip";

export const getData = async (url = ``) => {
  return fetch(url, {
    method: "GET", // *GET, POST, PUT, DELETE, etc.
    mode: "cors", // no-cors, cors, *same-origin
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "omit", // include, *same-origin, omit
    headers: {
      "Content-Type": "application/json"
    },
    redirect: "follow", // manual, *follow, error
    referrer: "no-referrer" // no-referrer, *client
  }).then(response => response.json()); // parses response to JSON
};

export const postData = async (url = ``, data = {}) => {
  // Default options are marked with *
  return fetch(url, {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    mode: "cors", // no-cors, cors, *same-origin
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "omit", // include, *same-origin, omit
    headers: {
      "Content-Type": "application/json"
    },
    redirect: "follow", // manual, *follow, error
    referrer: "no-referrer", // no-referrer, *client
    body: JSON.stringify(data) // body data type must match "Content-Type" header
  }).then(response => response.json()); // parses response to JSON
};

export const getFilename = (url: URL) => {
  const parts: string[] = url.pathname.split("/");
  return parts[parts.length - 1];
};

export const trimExtension = (filename: string) => {
  return filename.substr(0, filename.indexOf("."));
};

export const getVideoUrl = (video: string) => {
  const url: URL = new URL(urljoin(Config.endpoint, Config.videosRoute, video));
  return url;
};

export const getVideoDuration = async (url: URL) => {
  const filename: string = getFilename(url);
  return (await getData(
    urljoin(Config.endpoint, Config.durationRoute, filename)
  )) as number;
};

// export const addClip = async (clip: Clip) => {
//   return postData(urljoin(Config.endpoint, Config.addClipRoute), clip);
// };

// export const removeClip = async (clip: Clip) => {
//   return postData(urljoin(Config.endpoint, Config.removeClipRoute), clip);
// };

export const getVideoList = async () => {
  return getData(urljoin(Config.endpoint, Config.listVideosRoute));
};

export const mergeClips = async (clips: Clip[]) => {
  return postData(urljoin(Config.endpoint, Config.mergeClipsRoute), clips);
};
