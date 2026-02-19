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
      <div className="mb-3">
        <label htmlFor={labelFor} className="form-label">
          {labelText}
        </label>
        <div className="input-group">
          {img && (
            <span className="input-group-text">
              <img
                src={img}
                alt="icon"
                style={{ width: "20px", height: "20px" }}
              />
            </span>
          )}
          <input
            type={inputType}
            className="form-control"
            name={name}
            value={value}
            onChange={onChange}
          />
        </div>
      </div>
    </>
  );
};

export default InputType;
