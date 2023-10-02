import Image from "next/image";
import { useCallback } from "react";
import { Inter } from "next/font/google";
import { useEffect, useState, useRef } from "react";
import logo from "../../public/assets/logo.svg";
import profile from "../../public/assets/profile.svg";
import IconSearch from "../../public/assets/search.svg";
import { Bars } from "react-loader-spinner";
import MusicItem from "@/components/MusicItem";
import MusicWidget from "@/components/MusicWidget";

const inter = Inter({ subsets: ["latin"] });

// Is empty utils
function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}

export default function Home({ allSongs }) {
  const [currentTab, setCurrentTab] = useState("for-you"); // or top-tracks
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState(""); // search
  const [selectedSong, setSelectedSong] = useState({});
  const songsWithDurationRef = useRef(null);

  // Navigate to tab
  const navigateToTab = (tab) => {
    setCurrentTab(tab);
  };

  // Store initial props in state
  useEffect(() => {
    setLoading(true);

    const durations = [];
    let newAllSongs = [...allSongs];

    // Read duration from API
    newAllSongs.forEach((song) => {
      let url = song.url;
      // Urls sometimes contain whitespaces, which causes an error
      if (url.includes(" ")) {
        url = url.replace(" ", "");
      }

      try {
        const audio = new Audio(url);
        audio.addEventListener("loadedmetadata", () => {
          const duration = audio.duration;
          const timeLength = {
            minutes: Math.floor(audio.duration / 60),
            seconds: Math.floor(audio.duration % 60),
          };

          song.duration = `${timeLength.minutes}:${timeLength.seconds}`;
          durations.push(`${timeLength.minutes}:${timeLength.seconds}`);
        });
      } catch (e) {
        console.log("ERRORORORORORORR", song);
        song.duration = "0:00";
        console.log({ e });
      }
    });

    // Store allnewsongs in ref
    songsWithDurationRef.current = newAllSongs;

    // console.log({ durations, newAllSongs });
    setSongs([...newAllSongs]);
    setLoading(false);
  }, [allSongs]);

  // console.log(songsWithDurationRef.current);

  // Filter songs based on search query
  useEffect(() => {
    console.log({ query });
    if (query !== "") {
      setSongs((songs) =>
        songs.filter((song) =>
          song.name.toLowerCase().includes(query.toLowerCase())
        )
      );
    } else {
      setSongs(songsWithDurationRef.current);
    }
  }, [query]);

  return (
    <main
      className={`${inter.className} max-h-screen min-w-screen text-white p-8 flex flex-row`}
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
          <div className="overflow-auto no-scroll">
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
      <div className="flex basis-1/2 flex-row justify-center items-center max-h-screen">
        {!isEmpty(selectedSong) && <MusicWidget song={selectedSong} />}
      </div>
    </main>
  );
}

export async function getStaticProps() {
  const res = await fetch("https://cms.samespace.com/items/songs");
  const songs = await res.json();
  console.log({ songs });

  return { props: { allSongs: songs.data } };
}
