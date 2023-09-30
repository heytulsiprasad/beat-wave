import { useEffect, useState } from "react";
import Image from "next/image";

const MusicItem = ({ name, artist, coverId, trackUrl }) => {
  const [coverImg, setCoverImg] = useState("");

  useEffect(() => {
    async function getCoverImage(coverId) {
      if (coverId) {
        const { url } = await fetch(
          `https://cms.samespace.com/assets/${coverId}`
        );
        setCoverImg(url);
      }
    }

    getCoverImage(coverId);
  }, [coverId]);

  return (
    <div className="flex flex-row p-4 w-full rounded-lg justify-between items-center hover:cursor-pointer hover:bg-glass">
      <div className="flex flex-row gap-4 justify-center items-center">
        <div
          className="w-12 h-12 overflow-hidden relative rounded-full"
        >
          <Image
            src={coverImg}
            fill={true}
            className="max-h-full max-w-full"
            alt="Music Cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <div className="flex flex-col justify-start">
          <h4 className="text-lg">{name}</h4>
          <h6 className="text-md opacity-60">{artist}</h6>
        </div>
      </div>
      <div>
        <h6 className="opacity-60">{"4:16"}</h6>
      </div>
    </div>
  );
};

export default MusicItem;
