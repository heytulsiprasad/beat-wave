import { useEffect, useState } from "react";
import profile from "../../public/assets/profile.svg";
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
      <div className="flex flex-row gap-8">
        <div
          style={{ borderRadius: "50%" }}
          className="overflow-hidden w-12 h-12"
        >
          <Image
            src={coverImg}
            objectFit="cover"
            width={48}
            height={48}
            alt="Music Cover"
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
