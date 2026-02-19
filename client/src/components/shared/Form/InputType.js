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
    <>
      <div className="mb-1">
        <div className="d-flex align-items-center mb-1">
          {img && (
            <img
              src={img}
              alt="icon"
              style={{ width: "20px", height: "20px", marginRight: "8px" }}
            />
          )}
          <label htmlFor={labelFor} className="form-label mb-0">
            {labelText}
          </label>
        </div>
        <input
          type={inputType}
          className="form-control"
          name={name}
          value={value}
          onChange={onChange}
        />
      </div>
    </>
  );
};

export default InputType;
