import React, { useState } from "react";
import InputType from "./InputType";
import { Link } from "react-router-dom";
import { handleLogin, handleRegister } from "../../services/authService";
import { assets } from "../../assets";

const roles = [
  { id: "donar", label: "Donor", icon: "❤️" },
  { id: "admin", label: "Admin", icon: "🛡️" },
  { id: "hospital", label: "Hospital", icon: "🏥" },
  { id: "organisation", label: "Organisation", icon: "🏢" },
];

const Form = ({ formType, submitBtn, formTitle }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("donar");
  const [name, setName] = useState("");
  const [organisationName, setOrganisationName] = useState("");
  const [hospitalName, setHospitalName] = useState("");
  const [website, setWebsite] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");

  return (
    <div className="w-full max-w-md mx-auto">
      <form
        onSubmit={(e) => {
          if (formType === "login")
            return handleLogin(e, email, password, role);
          else if (formType === "register")
            return handleRegister(
              e,
              name,
              role,
              email,
              password,
              phone,
              organisationName,
              address,
              hospitalName,
              website
            );
        }}
        className="space-y-5"
      >
        {/* Title */}
        {formTitle && (
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-dark-200 tracking-tight">
              {formTitle}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {formType === "login"
                ? "Welcome back! Sign in to continue"
                : "Create your account to get started"}
            </p>
          </div>
        )}

        {/* Role Selector */}
        <div className="grid grid-cols-4 gap-2">
          {roles.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => setRole(r.id)}
              className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all duration-200 text-xs font-medium ${
                role === r.id
                  ? "border-blood-500 bg-blood-50 text-blood-600 shadow-md shadow-blood-500/10"
                  : "border-gray-200 bg-white text-gray-500 hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              <span className="text-lg">{r.icon}</span>
              <span>{r.label}</span>
            </button>
          ))}
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

        {/* Form Fields */}
        {(() => {
          //eslint-disable-next-line
          switch (true) {
            case formType === "login": {
              return (
                <>
                  <InputType
                    labelText={"Email"}
                    labelFor={"forEmail"}
                    inputType={"email"}
                    name={"email"}
                    value={email}
                    img={assets.email_icon}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <InputType
                    labelText={"Password"}
                    labelFor={"forPassword"}
                    inputType={"password"}
                    name={"password"}
                    value={password}
                    img={assets.lock_icon}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </>
              );
            }
            case formType === "register": {
              return (
                <>
                  {(role === "admin" || role === "donar") && (
                    <InputType
                      labelText={"Name"}
                      labelFor={"forName"}
                      inputType={"text"}
                      name={"name"}
                      value={name}
                      img={assets.profile_icon}
                      onChange={(e) => setName(e.target.value)}
                    />
                  )}
                  {role === "organisation" && (
                    <InputType
                      labelText={"Organisation Name"}
                      labelFor={"fororganisationName"}
                      inputType={"text"}
                      name={"organisationName"}
                      value={organisationName}
                      onChange={(e) => setOrganisationName(e.target.value)}
                    />
                  )}
                  {role === "hospital" && (
                    <InputType
                      labelText={"Hospital Name"}
                      labelFor={"forHospitalName"}
                      inputType={"text"}
                      name={"hospitalName"}
                      value={hospitalName}
                      onChange={(e) => setHospitalName(e.target.value)}
                    />
                  )}
                  <InputType
                    labelText={"Email"}
                    labelFor={"forEmail"}
                    inputType={"email"}
                    name={"email"}
                    value={email}
                    img={assets.email_icon}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <InputType
                    labelText={"Password"}
                    labelFor={"forPassword"}
                    inputType={"password"}
                    name={"password"}
                    value={password}
                    img={assets.lock_icon}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <InputType
                    labelText={"Address"}
                    labelFor={"forAddress"}
                    inputType={"text"}
                    name={"address"}
                    value={address}
                    img={assets.address_icon}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                  <InputType
                    labelText={"Phone"}
                    labelFor={"forPhone"}
                    inputType={"text"}
                    name={"phone"}
                    value={phone}
                    img={assets.phone_icon}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </>
              );
            }
          }
        })()}

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full mt-2 py-3.5 px-6 text-[15px] font-bold text-white bg-gradient-to-r from-blood-600 to-blood-500 hover:from-blood-700 hover:to-blood-600 rounded-2xl shadow-lg shadow-blood-600/25 hover:shadow-blood-600/40 transition-all duration-300 transform active:scale-[0.98]"
        >
          {submitBtn}
        </button>

        {/* Toggle Link */}
        <div className="text-center text-sm text-gray-500">
          {formType === "login" ? (
            <p>
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-blood-600 font-semibold hover:text-blood-700 transition-colors"
              >
                Register here
              </Link>
            </p>
          ) : (
            <p>
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-blood-600 font-semibold hover:text-blood-700 transition-colors"
              >
                Sign in
              </Link>
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default Form;
