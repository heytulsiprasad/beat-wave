import Image from "next/image";
import { useCallback } from "react";
import { Inter } from "next/font/google";
import { useEffect, useState } from "react";
import logo from "../../public/assets/logo.svg";
import profile from "../../public/assets/profile.svg";
import IconSearch from "../../public/assets/search.svg";
import { Bars } from "react-loader-spinner";
import MusicItem from "@/components/MusicItem";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [currentTab, setCurrentTab] = useState("for-you"); // or top-tracks
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState(""); // search
  const [selectedSong, setSelectedSong] = useState({});

  const navigateToTab = (tab) => {
    setCurrentTab(tab);
  };

  const getAllMusic = useCallback(async () => {
    setLoading(true);

    const data = await fetch("https://cms.samespace.com/items/songs");
    const results = await data.json();

    // const allSongsData = [...results.data];

    // console.log({ allSongsData });
    setSongs(results.data);
    setLoading(false);
  }, []);

  // Fetch all songs upon component mount
  useEffect(() => {
    getAllMusic();
  }, [getAllMusic]);

  useEffect(() => {
    console.log({ query });
    setSongs((songs) =>
      songs.filter((song) =>
        song.name.toLowerCase().includes(query.toLowerCase())
      )
    );

    // if query is empty bring to previous state
    if (query === "") {
      getAllMusic();
    }
  }, [query, getAllMusic]);

  return (
    <main
      className={`${inter.className} min-h-screen min-w-screen text-white p-8 flex flex-row`}
    >
      {/* Songs list */}
      <div className="flex gap-8 basis-1/2">
        <div className="flex flex-col justify-between">
          <div>
            <Image src={logo} alt="App logo" />
          </div>
          <div className="h-12 w-12 rounded-lg">
            <Image
              src={profile}
              alt="Profile"
              className="max-w-full max-h-full"
            />
          </div>
        </div>
        <div className="flex flex-col gap-8">
          <div className="flex flex-row text-2xl font-bold gap-10 mt-1">
            <button
              onClick={() => navigateToTab("for-you")}
              className={`${
                currentTab === "for-you" ? "opacity-100" : "opacity-50"
              } transition-opacity ease-in-out delay-75`}
            >
              <p>For you</p>
            </button>
            <button
              onClick={() => navigateToTab("top-tracks")}
              className={`${
                currentTab === "top-tracks" ? "opacity-100" : "opacity-50"
              } transition-opacity ease-in-out delay-75`}
            >
              <p>Top Tracks</p>
            </button>
          </div>
          <div id="search" className="relative">
            <Image
              src={IconSearch}
              alt="search icon"
              className="right-2 top-1 absolute"
            />
            <input
              type="text"
              placeholder="Search, Song, Artist"
              className="border-none px-4 py-2 text-lg text-white w-full rounded-lg focus:border-none"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.08)",
                width: "400px",
              }}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div>
            {loading ? (
              <div className="mt-12 flex flex-row justify-center items-center">
                <Bars
                  height="60"
                  width="60"
                  color="#fff"
                  ariaLabel="bars-loading"
                  visible={true}
                />
              </div>
            ) : (
              <>
                {songs.map((song) => (
                  <MusicItem
                    key={song.id}
                    song={song}
                    selectedSong={selectedSong}
                    setSelectedSong={setSelectedSong}
                  />
                ))}
              </>
            )}
          </div>
        </div>
      </div>
      {/* Player */}
      <div className="flex basis-1/2"></div>
    </main>
  );
}
