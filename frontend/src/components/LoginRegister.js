import React, { useState, useId } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth";
import "./LoginRegister.scss";

export function Register(props) {
  const auth = useAuth();
  const registerFormId = useId();
  const [registerRes, setRegisterRes] = useState(null);
  const redirect = useNavigate();

  return (
    <form id={registerFormId} className="AuthForm">
      <div>
        <input type={"text"} name={"username"} placeholder={"Username"}></input>
        {registerRes?.username && <div>{registerRes.username}</div>}
      </div>
      <div>
        <input
          type={"password"}
          name={"password1"}
          placeholder={"Password"}
        ></input>
        {registerRes?.password1 && <div>{registerRes.password1}</div>}
      </div>
      <div>
        <input
          type={"password"}
          name={"password2"}
          placeholder={"Confirm Password"}
        ></input>
        {registerRes?.password2 && <div>{registerRes.password2}</div>}
      </div>
      <div>
        <button
          onClick={async (event) => {
            event.preventDefault();
            let formData = new FormData(
              document.getElementById(registerFormId)
            );
            let res = await auth.register(formData);
            setRegisterRes(res);
            if (res.success) {
              setTimeout(() => {
                redirect("/");
              }, 2000);
            }
          }}
        >
          Register
        </button>
      </div>
      {registerRes?.success && <div>{registerRes.success}</div>}
      {registerRes?.error && <div>{registerRes.error}</div>}
    </form>
  );
}

export function Login() {
  const auth = useAuth();
  const loginFormId = useId();
  const [loginRes, setLoginRes] = useState(null);
  const redirect = useNavigate();

  return (
    <form id={loginFormId} className="AuthForm">
      <div>
        <input type={"text"} name={"username"} placeholder={"Username"}></input>
      </div>
      <div>
        <input
          type={"password"}
          name={"password"}
          placeholder={"Password"}
        ></input>
      </div>
      <div>
        <button
          onClick={async (event) => {
            event.preventDefault();
            let formData = new FormData(document.getElementById(loginFormId));
            let res = await auth.login(formData);
            setLoginRes(res);
            if (res.success) {
              setTimeout(() => {
                redirect("/");
              }, 1000);
            }
          }}
        >
          Log In
        </button>
      </div>
      {loginRes?.success && <div>{loginRes.success}</div>}
      {loginRes?.error && <div>{loginRes.error}</div>}
    </form>
  );
}
