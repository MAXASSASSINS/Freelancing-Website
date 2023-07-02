import React, { useState, useEffect } from "react";
import { Blurhash } from "react-blurhash";
import { getPosterForVideo } from "../../utility/util";
import { windowContext } from "../../App";

export const LazyVideo = ({ file, maxWidth, lazyLoad = false, aspectRatio = "auto" }) => {
  const { width, height, name, type, url, size, blurhash } = file;
  const defaultBlurhash = "LEHV6nWB2yk8pyo0adR*.7kCMdnj";

  const [loaded, setLoaded] = useState(false);

  const handleOnLoad = () => {
    setLoaded(true);
  };

  return (
    <div className="relative">
      <video
        data-poster={getPosterForVideo(file.url)}
        poster={lazyLoad ? "" : getPosterForVideo(file.url)}
        className="w-full"
        style={{ aspectRatio: aspectRatio }}
        src={file.url}
        alt=""
        controls
        preload="none"
      ></video>
      <Blurhash
        className="absolute z-20 top-0 left-0"
        hash={blurhash ? blurhash : defaultBlurhash}
        // width={maxWidth}
        // height={Math.min(height, (height / width) * maxWidth)}
        width="100%"
        height="100%"
        resolutionX={32}
        resolutionY={32}
        punch={1}
        style={!loaded ? { visibility: "visible" } : { visibility: "hidden" }}
      />
      <img
        src={getPosterForVideo(file.url)}
        alt=""
        className="hidden"
        onLoad={handleOnLoad}
      />
    </div>
  );
};
