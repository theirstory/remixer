import urljoin from "url-join";
import { Config } from "./Config";
import { Clip } from "./interfaces/Clip";
import { Info } from "./interfaces/Info";

export const cssUnits: string[] = [
  "%",
  "ch",
  "cm",
  "em",
  "ex",
  "in",
  "mm",
  "pc",
  "pt",
  "px",
  "rem",
  "vh",
  "vmax",
  "vmin",
  "vw"
];

export const addCssUnits = (d: string) => {
  if (
    !this.cssUnits.some(u => {
      return d.includes(u);
    })
  ) {
    d += "px"; // default to px
  }
  return d;
};

export const removeCssUnits = (value: string) => {
  cssUnits.forEach(u => {
    value = value.replace(u, "");
  })
  return value;
};

export const clamp = (min: number, n: number, max: number) => {
  return Math.max(min, Math.min(n, max));
};

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

export const formatTime = (time: number) => {
  let hours: number | string,
    minutes: number | string,
    seconds: number | string,
    hourValue: string;

  seconds = Math.ceil(time);
  hours = Math.floor(seconds / (60 * 60));
  hours = hours >= 10 ? hours : "0" + hours;
  minutes = Math.floor((seconds % (60 * 60)) / 60);
  minutes = minutes >= 10 ? minutes : "0" + minutes;
  seconds = Math.floor((seconds % (60 * 60)) % 60);
  seconds = seconds >= 10 ? seconds : "0" + seconds;

  if (hours >= 1) {
    hourValue = hours + ":";
  } else {
    hourValue = "";
  }

  return hourValue + minutes + ":" + seconds;
}

export const getCSSVar = (variable: string) => {
  const result: string = getComputedStyle(document.documentElement)
  .getPropertyValue(variable);
  return result.trim();
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

export const getRemixedVideoUrl = (video: string) => {
  const url: URL = new URL(
    urljoin(Config.endpoint, Config.remixedVideosRoute, video)
  );
  return url;
};

export const getVideoInfo = async (url: URL) => {
  const filename: string = getFilename(url);
  return (await getData(
    urljoin(Config.endpoint, Config.infoRoute, filename)
  )) as Info;
};

export const getVideoList = async () => {
  return getData(urljoin(Config.endpoint, Config.listVideosRoute));
};

export const remixClips = async (clips: Clip[]) => {
  return postData(urljoin(Config.endpoint, Config.remixRoute), clips);
};

export const getNextClipId = () => {
  return "clip-" + new Date().getTime();
};

// export const getNextClipId = () => {
//   return new Date().getTime();
//   // let highestId: number = -1;

//   // if (clips.length) {
//   //   highestId = Math.max.apply(
//   //     Math,
//   //     clips.map(clip => {
//   //       return clip.id;
//   //     })
//   //   );
//   // }

//   // return highestId + 1;
// };

export const sequenceClips = (clips: Clip[]) => {
  let offset: number = 0;

  const sequencedClips: Clip[] = [];

  for (let i = 0; i < clips.length; i++) {
    const clip: Clip = clips[i];
    const sequencedClip: Clip = Object.assign({}, clip);

    if (!isNaN(clip.start) && !isNaN(clip.end)) {
      const duration: number = clip.end - clip.start;
      sequencedClip.sequencedStart = offset;
      sequencedClip.sequencedEnd = offset + duration;
      offset += duration;
    }

    sequencedClips.push(sequencedClip);
  }

  return sequencedClips;
};

export const ratioToValue = (
  ratio: number,
  min: number,
  max: number
) => {
  let value = (max - min) * ratio;
  return clamp(min, value, max);
}

export const valueToRatio = (value: number, min: number, max: number) => {
  return clamp(0, (value - min) / (max - min), 1);
}
