import { useRef } from 'react';
import { useState, useEffect } from 'react';
import './App.css';
export default function App() {
        const [isVideoPlaying, setIsVideoPlaying] = useState(true);
        const [volumeOfVideo, setVolumeOfVideo] = useState(0);
        const [volumeCategory, setVolumeCategory] = useState("low")
        const videoRef = useRef(null);
        const videoContainerRef = useRef(null);
        const [playbackSpeed, setPlaybackSpeed] = useState(1)
        const [textElement, setTextElement] = useState(null);
        //const video = document.querySelector('video');
        const currentTimeElem = document.querySelector(".current-time")
        //const totalTimeElem = document.querySelector(".total-time")
        //const timelineContainer = document.querySelector(".timeline-container")
        //timline 

        // timelineContainer.addEventListener("mousemove", handleTimelineUpdate);
        //timelineContainer.addEventListener("mousedown", toggleScrubbing);
        const timelineContainer = useRef(null);
        document.addEventListener("mouseup", e => {
                if (isScrubbing) toggleScrubbing(e)
        })
        document.addEventListener("mousemove", e => {
                if (isScrubbing) handleTimelineUpdate(e)
        })
        let isScrubbing = false
        let wasPaused;
        function toggleScrubbing(e) {
                const rect = timelineContainer.current.getBoundingClientRect()
                const percent = Math.min(Math.max(0, e.x - rect.x), rect.width) / rect.width
                isScrubbing = (e.buttons & 1) === 1
                videoContainerRef.current.classList.toggle("scrubbing", isScrubbing)
                if (isScrubbing) {
                        wasPaused = videoRef.current.paused
                        videoRef.current.pause()
                } else {
                        videoRef.current.currentTime = percent * videoRef.current.duration
                        if (!wasPaused) videoRef.current.play()
                }

                handleTimelineUpdate(e)
        }

        function handleTimelineUpdate(e) {
                const rect = timelineContainer.current.getBoundingClientRect()
                const percent = Math.min(Math.max(0, e.x - rect.x), rect.width) / rect.width
                // const previewImgNumber = Math.max(
                //         1,
                //         Math.floor((percent * video.duration) / 10)
                // )
                // const previewImgSrc = `assets/previewImgs/preview${previewImgNumber}.jpg`
                // previewImg.src = previewImgSrc
                // timelineContainer.style.setProperty("--preview-position", percent)

                if (isScrubbing) {
                        e.preventDefault()
                        // thumbnailImg.src = previewImgSrc
                        timelineContainer.current.style.setProperty("--progress-position", percent)
                }
        }
        ///timer functionality
        function handleTimeupdateOfVideo() {
                currentTimeElem.textContent = formatDuration(videoRef.current.currentTime);
                const percent = videoRef.current.currentTime / videoRef.current.duration
                timelineContainer.current.style.setProperty("--progress-position", percent);
        }
        function handleLoadedData() {
                if (textElement) {
                        textElement.textContent = formatDuration(videoRef.current.duration)
                }
        }
        useEffect(() => {
                const textElement = document.querySelector(".total-time");
                setTextElement(textElement);
        }, [])
        const leadingZeroFormatter = new Intl.NumberFormat(undefined, {
                minimumIntegerDigits: 2,
        })
        function formatDuration(time) {
                const seconds = Math.floor(time % 60)
                const minutes = Math.floor(time / 60) % 60
                const hours = Math.floor(time / 3600)
                if (hours === 0) {
                        return `${minutes}:${leadingZeroFormatter.format(seconds)}`
                } else {
                        return `${hours}:${leadingZeroFormatter.format(
                                minutes
                        )}:${leadingZeroFormatter.format(seconds)}`
                }
        }
        function skip(duration) {
                console.log(duration)
                videoRef.current.currentTime += duration
        }
        // useEffect(() => {
        //         console.log(totalTimeElem.textContent)
        // })

        //playback speed
        function changePlaybackSpeed() {
                let newPlaybackRate = videoRef.current.playbackRate + 0.25
                if (newPlaybackRate > 2) newPlaybackRate = 0.25
                videoRef.current.playbackRate = newPlaybackRate
                setPlaybackSpeed(newPlaybackRate)
        }
        // video play pause
        function handleVideoPlayToggle() {
                setIsVideoPlaying(!isVideoPlaying)
                if (isVideoPlaying) {
                        videoRef.current.play()
                        //  play the timer after video pause
                        //console.log("in play   1      " + isVideoPlaying)

                }
                else {
                        videoRef.current.pause();
                        // pause the timer after video
                        //console.log("in pause  0    " + isVideoPlaying)
                }
        }

        // video playing modes
        function toggleTheaterMode() {
                videoContainerRef.current.classList.toggle("theater")
        }

        function toggleFullScreen() {
                console.log("in full screen")
                videoContainerRef.current.classList.toggle("full-screen")
        }
        function toggleMiniPlayer() {
                videoContainerRef.current.classList.toggle("mini-player") ? videoRef.current.requestPictureInPicture() : document.exitPictureInPicture()
        }
        //volume control 
        function toggleMute() {
                videoRef.current.muted = !videoRef.current.muted;
                if (videoRef.current.muted) {
                        setVolumeCategory("mute");
                        setVolumeOfVideo(0)
                } else {
                        setVolumeCategory("high");
                        setVolumeOfVideo(1)
                }
        }

        function handleVolumeSlider(e) {
                setVolumeOfVideo(e.target.value)
                videoRef.current.volume = volumeOfVideo;
                console.log(volumeOfVideo)
                if (volumeOfVideo > 0.7) {
                        setVolumeCategory("high")
                        console.log("high")
                } else if (volumeOfVideo < 0.7 && volumeOfVideo > 0.3) {
                        setVolumeCategory("low")
                        console.log("low")
                } else {
                        setVolumeCategory("mute")
                        console.log("mute")
                        videoRef.current.volume = 0
                }
        }


        document.onkeydown = (e) => {
                if (e.key.toLowerCase() === "l" || e.key === "ArrowRight") {
                        skip(5)
                }
                if (e.key.toLowerCase() === "j" || e.key === "ArrowLeft") {
                        skip(-5)
                }
                if (e.key.toLowerCase() === "m") {
                        toggleMute();
                }
                if (e.key.toLowerCase() === "i") {
                        toggleMiniPlayer();
                }
                if (e.key.toLowerCase() === "t") {
                        toggleTheaterMode();
                }
                if (e.key.toLowerCase() === "f") {
                        toggleFullScreen();
                }
                if (e.key === " " || e.key.toLowerCase() === "k") {
                        handleVideoPlayToggle();
                        console.log("in handlePlay")
                }
        }


        return (
                <div ref={videoContainerRef} className="video-container paused" volumelevel={`${volumeCategory}`} >
                        <div className="video-controls-container">
                                {/* <img className='thumbnail-indicator' alt="preview" /> */}
                                <div className="timeline-container" ref={timelineContainer} onMouseMove={handleTimelineUpdate} onMouseDown={toggleScrubbing}>
                                        <div className='timeline'>
                                                {/* <img className='preview-img' alt='preview' /> */}

                                        </div>
                                </div>
                                <div className="controls">
                                        {isVideoPlaying ? <button className="play-pause-btn" onClick={handleVideoPlayToggle}>
                                                <svg className="play-icon" viewBox="0 0 24 24">
                                                        <path fill="currentColor" d="M8,5.14V19.14L19,12.14L8,5.14Z" />
                                                </svg>
                                        </button> :
                                                <button className="play-pause-btn" onClick={handleVideoPlayToggle}>
                                                        <svg className="pause-icon" viewBox="0 0 24 24">
                                                                <path fill="currentColor" d="M14,19H18V5H14M6,19H10V5H6V19Z" />
                                                        </svg>
                                                </button>}
                                        <div className='volume-container'>
                                                <button className='mute-btn' onClick={toggleMute}>
                                                        <svg className="volume-high-icon" viewBox="0 0 24 24">
                                                                <path fill="currentColor" d="M14,3.23V5.29C16.89,6.15 19,8.83 19,12C19,15.17 16.89,17.84 14,18.7V20.77C18,19.86 21,16.28 21,12C21,7.72 18,4.14 14,3.23M16.5,12C16.5,10.23 15.5,8.71 14,7.97V16C15.5,15.29 16.5,13.76 16.5,12M3,9V15H7L12,20V4L7,9H3Z" />
                                                        </svg>
                                                        <svg className="volume-mute-icon" viewBox="0 0 24 24">
                                                                <path fill="currentColor" d="M12,4L9.91,6.09L12,8.18M4.27,3L3,4.27L7.73,9H3V15H7L12,20V13.27L16.25,17.53C15.58,18.04 14.83,18.46 14,18.7V20.77C15.38,20.45 16.63,19.82 17.68,18.96L19.73,21L21,19.73L12,10.73M19,12C19,12.94 18.8,13.82 18.46,14.64L19.97,16.15C20.62,14.91 21,13.5 21,12C21,7.72 18,4.14 14,3.23V5.29C16.89,6.15 19,8.83 19,12M16.5,12C16.5,10.23 15.5,8.71 14,7.97V10.18L16.45,12.63C16.5,12.43 16.5,12.21 16.5,12Z" />
                                                        </svg>
                                                        <svg className="volume-low-icon" viewBox="0 0 24 24">
                                                                <path fill="currentColor" d="M5,9V15H9L14,20V4L9,9M18.5,12C18.5,10.23 17.5,8.71 16,7.97V16C17.5,15.29 18.5,13.76 18.5,12Z" />
                                                        </svg>
                                                </button>
                                                <input className="volume-slider" type="range" min="0" max="1" step="any" value={volumeOfVideo} onChange={handleVolumeSlider} />
                                        </div>
                                        <div className='duration-container'>
                                                <div className="current-time">0.00</div>
                                                /
                                                <div className='total-time'></div>
                                        </div>

                                        <button className="speed-btn wide-btn" onClick={changePlaybackSpeed}>
                                                {playbackSpeed}x
                                        </button>
                                        <button className='mini-player-btn' onClick={toggleMiniPlayer}>
                                                <svg viewBox="0 0 24 24">
                                                        <path fill="currentColor" d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14zm-10-7h9v6h-9z" />
                                                </svg>
                                        </button>
                                        <button className='threater-btn' onClick={toggleTheaterMode}>
                                                <svg className="tall" viewBox="0 0 24 24">
                                                        <path fill="currentColor" d="M19 6H5c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 10H5V8h14v8z" />
                                                </svg>
                                                <svg className="wide" viewBox="0 0 24 24">
                                                        <path fill="currentColor" d="M19 7H5c-1.1 0-2 .9-2 2v6c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2zm0 8H5V9h14v6z" />
                                                </svg>
                                        </button>
                                        <button className='full-screen-btn' onClick={toggleFullScreen}>
                                                <svg className="open" viewBox="0 0 24 24">
                                                        <path fill="currentColor" d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
                                                </svg>
                                                <svg className="close" viewBox="0 0 24 24">
                                                        <path fill="currentColor" d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z" />
                                                </svg>
                                        </button>
                                </div>
                        </div>
                        <video src="https://archive.org/download/BigBuckBunny_124/Content/big_buck_bunny_720p_surround.mp4" ref={videoRef} onClick={handleVideoPlayToggle} onTimeUpdate={handleTimeupdateOfVideo} onLoadedData={handleLoadedData} />
                </div >
        );
}

// format for the timer of video                                          chetan added format for time
// let format = (time) => {
//         let hours = Math.floor((time / 60 / 60) * 24);
//         let minutes = Math.floor((time / 60) % 60);
//         let seconds = Math.floor(time % 60);
//         hours = hours < 10 ? '0' + hours : hours;
//         minutes = minutes < 10 ? '0' + minutes : minutes;
//         seconds = seconds < 10 ? '0' + seconds : seconds;
//         return hours + ':' + minutes + ':' + seconds;
// };
        // for video duration functionality
        // useEffect(() => {
        //         if (isRunning) {
        //                 console.log('in isRunnning');
        //                 timerRef.current = setInterval(() => {
        //                         setTime((time) => time + 1);

        //                 }, 1000);

        // const percent = videoRef.current.currrentTime / videoRef.current.duration;
        // console.log(percent)
        // timelineRef.current.style.setProperty("--progress-position", percent)
        //         }
        //         return () => {
        //                 clearInterval(timerRef.current);
        //         };
        // }, [isRunning]);