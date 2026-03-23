import React, { useState } from "react";
import { useSelector } from "react-redux";
import InputType from "./../Form/InputType";
import API from "./../../../services/API";
import { FiX } from "react-icons/fi";

const Modal = ({ isOpen, onClose }) => {
  const [inventoryType, setInventoryType] = useState("in");
  const [bloodGroup, setBloodGroup] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [email, setEmail] = useState("");
  const { user } = useSelector((state) => state.auth);

  // handle modal data
  const handleModalSubmit = async () => {
    try {
      if (!bloodGroup || !quantity) {
        return alert("Please Provide All Fields");
      }
      const { data } = await API.post("/inventory/create-inventory", {
        email,
        organisation: user?._id,
        inventoryType,
        bloodGroup,
        quantity,
      });
      if (data?.success) {
        alert("New Record Created");
        window.location.reload();
      }
    } catch (error) {
      alert(error.response.data.message);
      console.log(error);
      window.location.reload();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="relative w-full max-w-md bg-white rounded-2xl shadow-xl animate-fade-in-up"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <h2 className="text-lg font-bold text-dark-200">
              Manage Blood Record
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all duration-200"
            >
              <FiX size={20} />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 space-y-5">
            {/* Blood Type Radio */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-3">
                Blood Type
              </label>
              <div className="flex gap-3">
                <label
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 cursor-pointer transition-all duration-200 text-sm font-medium ${
                    inventoryType === "in"
                      ? "border-green-500 bg-green-50 text-green-700"
                      : "border-gray-200 text-gray-500 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="inRadio"
                    value="in"
                    defaultChecked
                    onChange={(e) => setInventoryType(e.target.value)}
                    className="sr-only"
                  />
                  <span className="w-2 h-2 rounded-full bg-green-500" />
                  IN
                </label>
                <label
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 cursor-pointer transition-all duration-200 text-sm font-medium ${
                    inventoryType === "out"
                      ? "border-red-500 bg-red-50 text-red-700"
                      : "border-gray-200 text-gray-500 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="inRadio"
                    value="out"
                    onChange={(e) => setInventoryType(e.target.value)}
                    className="sr-only"
                  />
                  <span className="w-2 h-2 rounded-full bg-red-500" />
                  OUT
                </label>
              </div>
            </div>

            {/* Blood Group Select */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">
                Blood Group
              </label>
              <select
                onChange={(e) => setBloodGroup(e.target.value)}
                className="w-full px-4 py-3 text-sm bg-gray-50 border border-gray-200 rounded-xl outline-none transition-all duration-200 focus:border-blood-500 focus:ring-2 focus:ring-blood-500/10 focus:bg-white hover:border-gray-300 cursor-pointer appearance-none"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E")`,
                  backgroundPosition: "right 12px center",
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "20px",
                }}
              >
                <option value="">Select blood group</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
              </select>
            </div>

            {/* Email & Quantity */}
            <InputType
              labelText={"Donor Email"}
              labelFor={"donarEmail"}
              inputType={"email"}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <InputType
              labelText={"Quantity (ML)"}
              labelFor={"quantity"}
              inputType={"Number"}
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-100">
            <button
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all duration-200"
            >
              Cancel
            </button>
            <button
              onClick={handleModalSubmit}
              className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blood-600 to-blood-500 hover:from-blood-700 hover:to-blood-600 rounded-xl shadow-md hover:shadow-glow transition-all duration-300"
            >
              Submit Record
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;
