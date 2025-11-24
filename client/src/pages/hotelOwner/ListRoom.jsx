import { useEffect, useState } from "react";
import Title from "../../components/Title";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const ListRoom = () => {
  const [rooms, setRooms] = useState([]);
  const { axios, getToken, user, currency } = useAppContext();

  // Fetch rooms for the hotel owner
  const fetchRooms = async () => {
    try {
      const { data } = await axios.get("/api/rooms/owner", {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });

      if (data.success) {
        setRooms(data.rooms);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Toggle Availability of the room
  const toggleAvailability = async (roomId) => {
    const { data } = await axios.post(
      "/api/rooms/toggle-availability",
      { roomId },
      {
        headers: { Authorization: `Bearer ${await getToken()}` },
      }
    );

    if (data.success) {
      toast.success(data.message);
      fetchRooms();
    } else {
      toast.error(data.message);
    }
  };

  useEffect(() => {
    if (user) {
      fetchRooms();
    }
  }, [user]);

  return (
    <div className="pb-40"> {/* Added bottom padding to prevent footer overlap */}
      <Title
        align="left"
        font="outfit"
        title="Room Listings"
        subTitle="View, edit, or manage all listed rooms. Keep the information up-to-date to provide the Best Experience for users."
      />

      <p className="text-gray-500 mt-8">All Rooms</p>

      {/* DESKTOP TABLE */}
      <div className="hidden sm:block w-full max-w-3xl text-left border border-gray-300 rounded-lg mt-3">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-4 text-gray-800 font-medium">Name</th>
              <th className="py-3 px-4 text-gray-800 font-medium">Facility</th>
              <th className="py-3 px-4 text-gray-800 font-medium">
                Price / night
              </th>
              <th className="py-3 px-4 text-gray-800 font-medium text-center">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="text-sm">
            {rooms.map((item, index) => (
              <tr key={index}>
                <td className="py-3 px-4 border-t text-gray-700">
                  {item.roomType}
                </td>

                <td className="py-3 px-4 border-t text-gray-700">
                  {item.amenities.join(", ")}
                </td>

                <td className="py-3 px-4 border-t text-gray-700">
                  {currency}
                  {item.pricePerNight}
                </td>

                <td className="py-3 px-4 border-t text-center">
                  <label className="relative inline-flex items-center cursor-pointer gap-3">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={item.isAvailable}
                      onChange={() => toggleAvailability(item._id)}
                    />
                    <div className="w-12 h-7 bg-slate-300 rounded-full peer peer-checked:bg-blue-600 transition" />
                    <span className="dot absolute left-1 top-1 w-5 h-5 bg-white rounded-full transition-transform peer-checked:translate-x-5"></span>
                  </label>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MOBILE VIEW */}
      <div className="sm:hidden mt-6 space-y-4">
        {rooms.map((item, index) => (
          <div
            key={index}
            className="border rounded-lg p-4 shadow-sm bg-white space-y-3"
          >
            <p className="text-lg font-semibold text-gray-800">
              {item.roomType}
            </p>

            <p className="text-gray-600 text-sm">
              <span className="font-medium">Facilities:</span>{" "}
              {item.amenities.join(", ")}
            </p>

            <p className="text-gray-600 text-sm">
              <span className="font-medium">Price:</span> {currency}
              {item.pricePerNight} / night
            </p>

            <div className="flex items-center justify-between mt-3">
              <p className="text-sm text-gray-700 font-medium">
                Availability:
              </p>

              <label className="relative inline-flex items-center cursor-pointer gap-3">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={item.isAvailable}
                  onChange={() => toggleAvailability(item._id)}
                />
                <div className="w-12 h-7 bg-slate-300 rounded-full peer peer-checked:bg-blue-600 transition"></div>
                <span className="dot absolute left-1 top-1 w-5 h-5 bg-white rounded-full transition-transform peer-checked:translate-x-5"></span>
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListRoom;
