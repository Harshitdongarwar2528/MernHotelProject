import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useParams, useNavigate } from "react-router-dom";
import { assets, facilityIcons, roomCommonData } from "../assets/assets";
import StarRating from "../components/StarRating";
import { useAppContext } from "../context/AppContext";

const RoomDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { rooms, getToken, axios } = useAppContext();

  const [room, setRoom] = useState(null);
  const [mainImage, setMainImage] = useState(null);
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [guests, setGuests] = useState(1);

  const [isAvailable, setIsAvailable] = useState(false);
  const [loading, setLoading] = useState(false);

  // Load room data
  useEffect(() => {
    const r = rooms.find((r) => r._id === id);
    if (r) {
      setRoom(r);
      setMainImage(r.images[0]);
    }
  }, [rooms, id]);

  // Check availability
  const checkAvailability = async () => {
    if (!checkInDate || !checkOutDate) {
      toast.error("Please select both dates.");
      return;
    }

    if (checkInDate >= checkOutDate) {
      toast.error("Check-In date must be before Check-Out date.");
      return;
    }

    try {
      const { data } = await axios.post("/api/bookings/check-availability", {
        room: id,
        checkInDate,
        checkOutDate,
      });

      if (data.success && data.isAvailable) {
        setIsAvailable(true);
        toast.success("Room is available!");
      } else {
        setIsAvailable(false);
        toast.error("Room is not available.");
      }
    } catch {
      toast.error("Failed to check availability.");
    }
  };

  // Booking function
  const bookNow = async () => {
    if (!isAvailable) return checkAvailability();
    if (loading) return;

    try {
      setLoading(true);

      // Wake server (important for Render)
      await axios.get("/api/health").catch(() => {});

      const { data } = await axios.post(
        "/api/bookings/book",
        {
          room: id,
          checkInDate,
          checkOutDate,
          guests,
          paymentMethod: "Pay At Hotel",
        },
        {
          headers: { Authorization: `Bearer ${await getToken()}` },
        }
      );

      if (data.success) {
        toast.success("Booking successful!");
        navigate("/my-bookings");
        window.scrollTo(0, 0);
      } else {
        toast.error(data.message);
      }
    } catch {
      toast.error("Booking failed.");
    } finally {
      setLoading(false);
    }
  };

  if (!room) return null;

  return (
    <div className="py-28 md:py-35 px-4 md:px-16 lg:px-24 xl:px-32">

      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-2">
        <h1 className="text-3xl md:text-4xl font-playfair">
          {room.hotelName || room.hotel.name}{" "}
          <span className="font-inter text-sm">({room.roomType})</span>
        </h1>
        <p className="text-xs py-1.5 px-3 text-white bg-orange-500 rounded-full">
          20% OFF
        </p>
      </div>

      <div className="flex items-center gap-1 mt-2">
        <StarRating />
        <p className="ml-2">200+ reviews</p>
      </div>

      {/* Address */}
      <div>
        <img src={assets.locationIcon} alt="location" />
        <span>{room.hotelAddress || room.hotel.address}</span>
      </div>

      {/* Images */}
      <div className="flex flex-col lg:flex-row mt-6 gap-6">
        <div className="lg:w-1/2 w-full h-[400px]">
          <img
            src={mainImage}
            className="w-full h-full rounded-xl shadow-lg object-cover"
          />
        </div>

        <div className="grid grid-cols-2 gap-4 lg:w-1/2 h-[400px]">
          {room.images.map((img, index) => (
            <div
              key={index}
              onClick={() => setMainImage(img)}
              className="w-full h-full rounded-xl overflow-hidden cursor-pointer"
            >
              <img
                src={img}
                className={`w-full h-full object-cover ${
                  mainImage === img && "outline outline-4 outline-orange-500"
                }`}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Booking Box */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between bg-white shadow-lg p-6 rounded-xl mx-auto mt-16 max-w-6xl">

        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-10 text-gray-500">

          <div className="flex flex-col">
            <label className="font-medium">Check-In</label>
            <input
              type="date"
              min={new Date().toISOString().split("T")[0]}
              value={checkInDate}
              onChange={(e) => setCheckInDate(e.target.value)}
              className="w-full rounded border px-3 py-2 mt-1.5"
            />
          </div>

          <div className="flex flex-col">
            <label className="font-medium">Check-Out</label>
            <input
              type="date"
              min={checkInDate}
              disabled={!checkInDate}
              value={checkOutDate}
              onChange={(e) => setCheckOutDate(e.target.value)}
              className="w-full rounded border px-3 py-2 mt-1.5"
            />
          </div>

          <div className="flex flex-col">
            <label className="font-medium">Guests</label>
            <input
              type="number"
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
              className="max-w-20 rounded border px-3 py-2 mt-1.5"
            />
          </div>

        </div>

        <button
          onClick={bookNow}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-600 text-white rounded-md md:px-12 py-3 mt-6 md:mt-0"
        >
          {isAvailable ? "Book Now" : "Check Availability"}
        </button>
      </div>

    </div>
  );
};

export default RoomDetails;
