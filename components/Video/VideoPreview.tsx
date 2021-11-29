import React, { Suspense, useEffect,useState } from 'react'
import { oembed } from "@loomhq/loom-embed";
import styles from './Video.module.scss';
const VideoPreview = ({ videoData }) => { 
    const [videoHTML, setVideoHTML] = useState("");
 
    const loadVideo = async() => { 
        if(videoData&& videoData.embedUrl){
            const { html } = await oembed(videoData.sharedUrl, { width: 600, height: 300 });
            setVideoHTML(html);
        }
    }
    useEffect(() => { 
        console.log(videoData);
       loadVideo();
    }, [videoData]);
    return (<div className= {styles.videoPreview}>
                <Suspense fallback={<div>Loading...</div>}>
                    <div dangerouslySetInnerHTML={{ __html: videoHTML }}></div>
                </Suspense>
            </div>)
}

export default VideoPreview;