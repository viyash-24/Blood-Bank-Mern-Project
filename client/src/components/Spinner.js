import React from "react";
import { BiDonateBlood } from "react-icons/bi";

const Spinner = () => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm">
      <div className="relative">
        <div className="w-16 h-16 rounded-full border-4 border-gray-200 border-t-blood-600 animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <BiDonateBlood className="text-blood-600 animate-blood-drop" size={24} />
        </div>
      </div>
      <p className="mt-4 text-sm font-medium text-gray-500 animate-pulse">
        Loading...
      </p>
    </div>
  );
};

export default Spinner;
