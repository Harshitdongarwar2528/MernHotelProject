import React, { useState } from "react";
import { assets, cities } from "../assets/assets";
import { useAppContext } from "../context/AppContext";

const Hero = () => {
  const { navigate, getToken, axios, setSearchedCities } = useAppContext();
  const [destination, setDestination] = useState("");

  const onSearch = async (e) => {
    e.preventDefault();
    navigate(`/rooms?destination=${destination}`);

    await axios.post(
      "/api/users/store-recent-search",
      {
        recentSearchedCity: destination,
      },
      {
        headers: { Authorization: `Bearer ${await getToken()}` },
      }
    );

    setSearchedCities((prev) => {
      const updated = [...prev, destination];
      if (updated.length > 3) updated.shift();
      return updated;
    });
  };

  return (
    <div className='relative flex flex-col items-start justify-center px-6 md:px-16 lg:px-24 xl:px-32 h-screen bg-[url("/src/assets/heroImage2.jpg")] bg-no-repeat bg-cover bg-center'>
      {/* DARK OVERLAY */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/40"></div>

      {/* CONTENT ABOVE OVERLAY */}
      <div className="relative z-10 text-white">
        <p className="inline-block bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/30 text-white">
          The Ultimate Hotel Experience
        </p>

        <h1 className="font-playfair text-2xl md:text-5xl md:text-[56px] md:leading-[56px] font-bold max-w-xl mt-4 text-white drop-shadow-[0_3px_6px_rgba(0,0,0,0.6)]">
          Discover Your Perfect Getaway Destination
        </h1>

        <p className="max-w-130px mt-2 text-sm md:text-base text-white drop-shadow-[0_3px_6px_rgba(0,0,0,0.6)]">
          Unparalleded luxary and comfort await at the world's most exclusive{" "}
          <br />
          hotels and resorts. Start your journey today
        </p>

        <form
          onSubmit={onSearch}
          className="bg-white/90 backdrop-blur-md shadow-xl text-gray-800 rounded-lg px-6 py-4 mt-8 flex flex-col md:flex-row max-md:items-start gap-4 max-md:mx-auto "
        >
          <div>
            <div className="flex items-center gap-2 text-black drop-shadow-[0_3px_6px_rgba(0,0,0,0.6)]">
              <img
                src={assets.calenderIcon}
                alt="clendar"
                className="h-4 brightness-200"
              />
              <label htmlFor="destinationInput">Destination</label>
            </div>
            <input
              onChange={(e) => setDestination(e.target.value)}
              value={destination}
              list="destinations"
              id="destinationInput"
              type="text"
              className="rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none text-black"
              placeholder="Type here"
              required
            />
            <datalist id="destinations">
              {cities.map((city, index) => (
                <option value={city} key={index} />
              ))}
            </datalist>
          </div>

          <div>
            <div className="flex items-center gap-2 text-black">
              <img src={assets.calenderIcon} alt="" className="h-4" />
              <label htmlFor="checkIn">Check in</label>
            </div>
            <input
              id="checkIn"
              type="date"
              className="rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none text-black"
            />
          </div>

          <div>
            <div className="flex items-center gap-2 text-black">
              <img src={assets.calenderIcon} alt="" className="h-4" />
              <label htmlFor="checkOut">Check out</label>
            </div>
            <input
              id="checkOut"
              type="date"
              className="rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none text-black"
            />
          </div>

          <div className="flex md:flex-col max-md:gap-2 max-md:items-center text-black">
            <label htmlFor="guests">Guests</label>
            <input
              min={1}
              max={4}
              id="guests"
              type="number"
              className="rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none max-w-16 text-black"
              placeholder="0"
            />
          </div>

          <button className="flex items-center justify-center gap-1 rounded-md bg-black py-3 px-4 text-white my-auto cursor-pointer max-md:w-full max-md:py-1 ">
            <img src={assets.searchIcon} alt="search Icon" className="h-7" />
            <span>Search</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default Hero;
