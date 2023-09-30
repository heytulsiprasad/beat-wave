import React from "react";
import Image from "next/image";

const MusicWidget = ({ song }) => {
  return (
    <div>
      <h1>{song.name}</h1>
      <h2>{song.artist}</h2>
      <div className="h-40 w-40 relative">
        <Image
          src={`https://cms.samespace.com/assets/${song.cover}`}
          fill={true}
          alt="Music Cover"
          className="max-h-full max-w-full"
        />
      </div>
    </div>
  );
};

export default MusicWidget;
