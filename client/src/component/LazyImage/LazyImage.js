import React, { useState, useEffect } from "react";
import { Blurhash } from "react-blurhash";

export const LazyImage = ({ file, maxWidth }) => {
  const { width, height, name, type, url, size, blurhash } = file;
  const defaultBlurhash = "LEHV6nWB2yk8pyo0adR*.7kCMdnj";

  const [loaded, setLoaded] = useState(false);

  const handleOnLoad = () => {
    setLoaded(true);
  };

  return (
    <div className="relative max-w-[10rem] lg:max-w-[15rem] flex justify-center items-center">
      <img
        data-src={url}
        className="absolute rounded"
        src={""}
        alt={name}
        onLoad={handleOnLoad}
      />
      <Blurhash
        className="relative z-20 top-0 left-0 rounded"
        hash={blurhash ? blurhash : defaultBlurhash}
        width={maxWidth}
        height={Math.min(height, (height / width) * maxWidth)}
        resolutionX={32}
        resolutionY={32}
        punch={1}
        style={!loaded ? { visibility: "visible" } : { visibility: "hidden" }}
      />
    </div>
  );
};
