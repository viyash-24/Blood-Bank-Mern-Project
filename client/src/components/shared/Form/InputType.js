import React from "react";

const InputType = ({
  labelText,
  labelFor,
  inputType,
  value,
  onChange,
  name,
  img,
}) => {
  return (
    <div className="mb-4">
      <label
        htmlFor={labelFor}
        className="block text-sm font-medium text-gray-600 mb-1.5"
      >
        {labelText}
      </label>
      <div className="relative">
        {img && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <img
              src={img}
              alt="icon"
              className="w-5 h-5 opacity-40"
            />
          </div>
        )}
        <input
          type={inputType}
          id={labelFor}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={`Enter ${labelText.toLowerCase()}`}
          className={`w-full px-4 py-3 text-sm bg-gray-50 border border-gray-200 rounded-xl outline-none transition-all duration-200 placeholder:text-gray-400 focus:border-blood-500 focus:ring-2 focus:ring-blood-500/10 focus:bg-white hover:border-gray-300 ${
            img ? "pl-11" : ""
          }`}
        />
      </div>
    </div>
  );
};

export default InputType;
