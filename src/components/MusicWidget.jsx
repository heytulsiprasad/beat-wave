import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  IconDots,
  IconVolume,
  IconPlayerPlayFilled,
  IconPlayerPauseFilled,
  IconPlayerTrackNextFilled,
  IconPlayerTrackPrevFilled,
  IconVolume3,
} from "@tabler/icons-react";
import { toast } from "react-toastify";

function isValidHttpUrl(string) {
  let url;

  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }

  return url.protocol === "http:" || url.protocol === "https:";
}

const MusicWidget = ({ song, handleNextSong, handlePrevSong }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef();
  const progressRef = useRef();
  const playAnimationRef = useRef();
  const [muteVolume, setMuteVolume] = useState(false);

  useEffect(() => {
    // Update isPlaying when song is changed
    setIsPlaying(false);

    // Update accent color when selected color is changed
    document.body.style.setProperty("--accent-background", song.accent);

    // When audio url is invalid
    if (!isValidHttpUrl(song.url)) {
      toast.error("The song URL is invalid!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    }
  }, [song]);

  const repeatAnimation = useCallback(() => {
    const currentTime = audioRef.current?.currentTime;
    progressRef.current.value = currentTime || 0;
    progressRef.current.style.setProperty(
      "--range-progress",
      `${(progressRef.current.value / audioRef.current.duration) * 100}%`
    );

    playAnimationRef.current = requestAnimationFrame(repeatAnimation);
  }, []);

  const togglePlayPause = () => {
    setIsPlaying((prev) => !prev);
  };

  const handleProgressUpdate = () => {
    audioRef.current.currentTime = progressRef.current.value;
  };

  const toggleMuteVolume = () => {
    setMuteVolume((prev) => !prev);
  };

  useEffect(() => {
    if (isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }

    playAnimationRef.current = requestAnimationFrame(repeatAnimation);

    () => {
      cancelAnimationFrame(playAnimationRef.current);
    };
  }, [isPlaying, audioRef, repeatAnimation]);

  useEffect(() => {
    if (audioRef) {
      audioRef.current.volume = muteVolume ? 0 : 1;
      audioRef.current.muted = muteVolume;
    }
  }, [muteVolume]);

  return (
    <div className="flex flex-col items-start h-full w-full p-16">
      <h1 className="font-bold text-3xl mb-2">{song.name}</h1>
      <h2 className="font-normal text-sm opacity-60">{song.artist}</h2>
      <div className="h-full w-full relative mt-8 p-40">
        <Image
          src={`https://cms.samespace.com/assets/${song.cover}`}
          fill={true}
          alt="Music Cover"
          className="max-h-full max-w-full rounded-lg"
        />
      </div>
      <div className="my-4 flex-col w-full ">
        <div>
          <audio src={song.url} ref={audioRef} />
        </div>
        {/* Slider */}
        <div className="mb-6">
          <input
            type="range"
            ref={progressRef}
            defaultValue="0"
            onChange={handleProgressUpdate}
          />
        </div>
        {/* Controls */}
        <div className="flex flex-row w-full justify-between items-center">
          <button className="bg-layer w-12 h-12 rounded-full flex flex-row justify-center items-center">
            <IconDots size={24} />
          </button>
          <div className="flex flex-row gap-8">
            <button
              onClick={handlePrevSong}
              className="flex flex-row justify-center items-center opacity-60"
            >
              <IconPlayerTrackPrevFilled size={20} />
            </button>
            <button
              style={{ backgroundColor: "#fff" }}
              onClick={togglePlayPause}
              className="w-12 h-12 rounded-full flex flex-row justify-center items-center"
            >
              {isPlaying ? (
                <IconPlayerPauseFilled style={{ color: "#000" }} size={24} />
              ) : (
                <IconPlayerPlayFilled style={{ color: "#000" }} size={24} />
              )}
            </button>
            <button
              onClick={handleNextSong}
              className="flex flex-row justify-center items-center opacity-60"
            >
              <IconPlayerTrackNextFilled size={20} />
            </button>
          </div>
          <button
            onClick={toggleMuteVolume}
            className="bg-layer w-12 h-12 rounded-full flex flex-row justify-center items-center"
          >
            {muteVolume ? <IconVolume3 size={24} /> : <IconVolume size={24} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MusicWidget;
