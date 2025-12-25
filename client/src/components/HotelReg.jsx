import { useState } from "react";
import { assets, cities } from "../assets/assets";
import { useAppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const HotelReg = () => {
  const {
    setShowHotelReg,
    axios,
    getToken,
    setIsOwner,
    isOwner, // 👈 read current value
    user,
  } = useAppContext();

  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [contact, setContact] = useState("");
  const [city, setCity] = useState("");

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    console.log("🚀 SUBMIT CLICKED");
    console.log("Form Data:", { name, contact, address, city });

    try {
      const token = await getToken();
      console.log("🔐 Clerk Token:", token ? "PRESENT" : "MISSING");

      const { data } = await axios.post(
        `/api/hotels/`,
        { name, contact, address, city },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

console.log("📦 API RESPONSE FULL:", JSON.stringify(data, null, 2));

      if (data.success) {
        toast.success(data.message + " ✔");

        console.log("✅ SETTING isOwner = true (before):", isOwner);
        setIsOwner(true);
        console.log("✅ setIsOwner CALLED");

        setShowHotelReg(false);
        console.log("❌ MODAL CLOSED");

        navigate("/");
        console.log("➡️ NAVIGATED TO HOMEPAGE");
      } else {
        console.log("❌ BACKEND SAID FAILURE");
        toast.error(data.message);
      }
    } catch (error) {
      console.error("🔥 ERROR OCCURRED:", error);
      toast.error(error.message);
    }
  };

  return (
    <div
      onClick={() => setShowHotelReg(false)}
      className="fixed top-0 bottom-0 left-0 right-0 z-100 flex items-center justify-center bg-black/70"
    >
      <form
        onSubmit={onSubmitHandler}
        onClick={(e) => e.stopPropagation()}
        className="flex bg-white rounded-xl max-w-4xl max-md:mx-2"
      >
        <img
          src={assets.regImage}
          alt="reg-Image"
          className="w-1/2 rounded-xl hidden md:block"
        />

        <div className="relative flex flex-col items-center md:w-1/2 p-8 md:p-10">
          <img
            src={assets.closeIcon}
            alt="close-icon"
            className="absolute top-4 right-4 h-4 w-4 cursor-pointer"
            onClick={() => setShowHotelReg(false)}
          />

          <p className="text-2xl font-semibold mt-6">Register Your Hotel</p>

          <div className="w-full mt-4">
            <label className="font-medium text-gray-500">Hotel Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border rounded w-full px-3 py-2.5 mt-1"
              required
            />
          </div>

          <div className="w-full mt-4">
            <label className="font-medium text-gray-500">Phone</label>
            <input
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              className="border rounded w-full px-3 py-2.5 mt-1"
              required
            />
          </div>

          <div className="w-full mt-4">
            <label className="font-medium text-gray-500">Address</label>
            <input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="border rounded w-full px-3 py-2.5 mt-1"
              required
            />
          </div>

          <div className="w-full mt-4 max-w-60 mr-auto">
            <label className="font-medium text-gray-500">City</label>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="border rounded w-full px-3 py-2.5 mt-1"
              required
            >
              <option value="">Select City</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="bg-indigo-500 text-white px-6 py-2 rounded mt-6"
          >
            Register
          </button>
        </div>
      </form>
    </div>
  );
};

export default HotelReg;
