import React, { useState, useEffect } from 'react'
import { Blurhash } from "react-blurhash";
import { getPosterForVideo } from '../../utility/util';
import { windowContext } from '../../App';

export const LazyVideo = ({file, maxWidth}) => {

    const { width, height, name, type, url, size, blurhash } = file;
    const defaultBlurhash = "LEHV6nWB2yk8pyo0adR*.7kCMdnj"

    const [loaded, setLoaded] = useState(false)




    const handleOnLoad = () => {
        setLoaded(true)
    }


    return (
        <div className='relative max-w-[10rem] lg:max-w-[15rem]'>
            <video
                // poster={getPosterForVideo(item.message.text)}
                data-poster={getPosterForVideo(file.url)}
                poster=""
                className='w-full absolute'
                src={file.url}
                alt=""
                controls
                preload='none'>
            </video>
            <Blurhash
                className='relative z-20 top-0 left-0'
                hash={blurhash ? blurhash : defaultBlurhash}
                width={maxWidth}
                // height={() => { return (height / width) * maxWidth }}
                height={Math.min(height, height / width * maxWidth)}
                resolutionX={32}
                resolutionY={32}
                punch={1}
                style={!loaded ? { visibility: "visible" } : { visibility: "hidden" }}
            />
            <img
                src={getPosterForVideo(file.url)}
                alt=""
                className='hidden'
                onLoad={handleOnLoad}
            />

        </div>
    )
}
