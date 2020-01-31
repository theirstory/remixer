import urljoin from "url-join";
import { Config } from "./Config";
import { Info } from "./interfaces/Info";
import { Annotation, AnnotationMap, Motivation } from "./interfaces/Annotation";
import { SequencedDuration } from "./interfaces/SequencedDuration";

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
  });
  return value;
};

export const clamp = (min: number, n: number, max: number) => {
  return Math.max(min, Math.min(n, max));
};

export const compareMapKeys = (map1, map2) => {
  for (var [key] of map1) {
    if (!map2.get(key)) {
      return false;
    }
  }
  return true;
}

export const round = (num: number) => {
  return Math.round((num + Number.EPSILON) * 100) / 100;
}

export const sequencedDurationsAreEqual = (duration1: SequencedDuration, duration2: SequencedDuration) => {
  return duration1.sequencedStart === duration2.sequencedStart && duration1.sequencedEnd === duration2.sequencedEnd;
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

export const filterAnnotationsByMotivation = (annotations: AnnotationMap, motivation: Motivation, exclude: boolean = false) => {
  return new Map<string, Annotation>(Array.from(annotations).filter(annotation => {
    const m: Motivation = annotation[1].motivation;
    return exclude ? m !== motivation : m === motivation;
  }));
}

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
};

export const getCSSVar = (variable: string) => {
  const result: string = getComputedStyle(
    document.documentElement
  ).getPropertyValue(variable);
  return result.trim();
};

export const getFilename = (url: URL) => {
  const parts: string[] = url.pathname.split("/");
  return parts[parts.length - 1];
};

export const trimExtension = (filename: string) => {
  return filename.substr(0, filename.indexOf("."));
};

export const getMediaUrl = (media: string) => {
  const url: URL = new URL(urljoin(Config.endpoint, Config.mediaRoute, media));
  return url;
};

export const getRemixedMediaUrl = (media: string) => {
  const url: URL = new URL(
    urljoin(Config.endpoint, Config.remixedMediaRoute, media)
  );
  return url;
};

export const getMediaInfo = async (url: URL) => {
  const filename: string = getFilename(url);
  return (await getData(
    urljoin(Config.endpoint, Config.infoRoute, filename)
  )) as Info;
};

export const getMediaList = async () => {
  return getData(urljoin(Config.endpoint, Config.listMediaRoute));
};

export const remixAnnotations = async (annotations: AnnotationMap) => {
  return postData(urljoin(Config.endpoint, Config.remixRoute), Array.from(annotations));
};

export const getNextAnnotationId = () => {
  return "anno-" + new Date().getTime();
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

export const mergeAnnotationMaps = (a: AnnotationMap, b: AnnotationMap) => {
  return new Map<string, Annotation>([...Array.from(a), ...Array.from(b)]);
}

export const retargetClip = (selection: SequencedDuration, annotation: Annotation) => {
  const start: number = Math.max((selection.start - annotation.sequencedStart) + annotation.start, 0);
  const end: number = Math.min((selection.end - annotation.sequencedEnd) + annotation.end, annotation.bodyDuration);
  return {
    start: start,
    end: end
  }
}

export const sequenceClips = (clips: AnnotationMap) => {

  // ensure we're only sequencing annotations with the "editing" motivation
  const edits: AnnotationMap = filterAnnotationsByMotivation(clips, Motivation.EDITING);

  let offset: number = 0;

  const sequencedEdits: AnnotationMap = new Map<string, Annotation>();

  edits.forEach((annotation: Annotation, key: string) => {
    const sequencedAnnotation: Annotation = Object.assign({}, annotation);

    if (!isNaN(annotation.start) && !isNaN(annotation.end)) {
      const duration: number = annotation.end - annotation.start;
      sequencedAnnotation.sequencedStart = offset;
      sequencedAnnotation.sequencedEnd = offset + duration;
      offset += duration;
    }

    sequencedEdits.set(key, sequencedAnnotation);
  });

  const nonSequencedEdits: AnnotationMap = filterAnnotationsByMotivation(clips, Motivation.EDITING, true);

  const merged: AnnotationMap = mergeAnnotationMaps(sequencedEdits, nonSequencedEdits);

  return merged;
};

function compare(a: any, b: any): string[] {
  const changed: string[] = [];
  Object.keys(a).forEach(p => {
    if (!Object.is(b[p], a[p])) {
      changed.push(p);
    }
  });
  return changed;
}

export function diff<T>(a: T, b: T): string[] {
  return Array.from(
    new Set(
      compare(a, b).concat(compare(b, a))
    )
  );
}

// export const shallowCompare = (obj1: any, obj2: any) => {
//   if (obj1 === null || obj1 === undefined || obj2 === null || obj2 === undefined) {
//     return false;
//   }
//   return Object.keys(obj1).length === Object.keys(obj2).length &&
//   Object.keys(obj1).every(key =>
//     obj2.hasOwnProperty(key) && obj1[key] === obj2[key]
// )};

export const ratioToValue = (ratio: number, min: number, max: number) => {
  let value = (max - min) * ratio;
  return clamp(min, value, max);
};

export const valueToRatio = (value: number, min: number, max: number) => {
  return clamp(0, (value - min) / (max - min), 1);
};
