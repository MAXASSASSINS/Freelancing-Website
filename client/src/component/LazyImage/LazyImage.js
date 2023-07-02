import React, { useState, useEffect } from "react";
import { Blurhash } from "react-blurhash";

export const LazyImage = ({ file, maxWidth, lazyLoad = false, aspectRatio = 16/10 }) => {
  const { width, height, name, type, url, size, blurhash } = file;
  const defaultBlurhash = "LEHV6nWB2yk8pyo0adR*.7kCMdnj";

  // console.log(file);
  const [loaded, setLoaded] = useState(false);

  const handleOnLoad = () => {
    setLoaded(true);
  };

  return (
    <div className="relative">
      <img
        data-src={url}
        className="w-full"
        style={{ aspectRatio: aspectRatio }}
        // src={url}
        src={lazyLoad ? "" : url}
        alt={name}
        onLoad={handleOnLoad}
      />
      <Blurhash
        className="absolute z-20 top-0 left-0"
        hash={blurhash ? blurhash : defaultBlurhash}
        // width={maxWidth}
        width="100%"
        height="100%"
        // height={Math.min(height, (height / width) * maxWidth)}
        resolutionX={32}
        resolutionY={32}
        punch={1}
        style={!loaded ? { visibility: "visible" } : { visibility: "hidden" }}
      />
    </div>
  );
};
