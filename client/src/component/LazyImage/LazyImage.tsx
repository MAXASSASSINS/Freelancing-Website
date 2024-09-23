import { useState } from "react";
import { Blurhash } from "react-blurhash";
import { IImage } from "../../types/gig.types";

type LazyImageProps = {
  file: IImage;
  lazyLoad?: boolean;
  aspectRatio?: string | number;
  objectFit?: "contain" | "cover" | "fill" | "none" | "scale-down";
}

export const LazyImage = ({ file, lazyLoad = false, aspectRatio = "auto", objectFit = "cover" }: LazyImageProps) => {
  const { url, blurhash } = file;
  const defaultBlurhash = "LEHV6nWB2yk8pyo0adR*.7kCMdnj";

  const [loaded, setLoaded] = useState<boolean>(false);

  const handleOnLoad = () => {
    setLoaded(true);
  };

  return (
    <div className="relative">
      <img
        data-src={url}
        className="w-full"
        style={{ aspectRatio: aspectRatio, objectFit: objectFit }}
        src={lazyLoad ? "" : url}
        alt='gig'
        onLoad={handleOnLoad}
      />
      <Blurhash
        className="absolute z-20 top-0 left-0"
        hash={blurhash ? blurhash : defaultBlurhash}
        width="100%"
        height="100%"
        resolutionX={32}
        resolutionY={32}
        punch={1}
        style={!loaded ? { visibility: "visible" } : { visibility: "hidden" }}
      />
    </div>
  );
};
