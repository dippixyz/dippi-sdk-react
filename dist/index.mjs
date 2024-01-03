// src/styles.module.css
var styles_default = {};

// src/components/SignIn/index.tsx
import { useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
var SignInForm = () => {
  const [showSignUp, setShowSignUp] = useState(false);
  const toggleForm = () => setShowSignUp(!showSignUp);
  const handleSignIn = (e) => {
    e.preventDefault();
  };
  const handleSignUp = (e) => {
    e.preventDefault();
  };
  return showSignUp ? /* @__PURE__ */ jsx("div", { className: "modalContainer", children: /* @__PURE__ */ jsxs(
    "form",
    {
      onSubmit: handleSignUp,
      children: [
        /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
          /* @__PURE__ */ jsx(
            "label",
            {
              className: "block text-gray-700 text-sm font-bold mb-2",
              htmlFor: "signin-email",
              children: "Email:"
            }
          ),
          /* @__PURE__ */ jsx(
            "input",
            {
              className: "shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline",
              id: "signin-email",
              name: "email",
              type: "text",
              placeholder: "Email"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
          /* @__PURE__ */ jsx(
            "label",
            {
              className: "block text-gray-700 text-sm font-bold mb-2",
              htmlFor: "signin-password",
              children: "Password:"
            }
          ),
          /* @__PURE__ */ jsx(
            "input",
            {
              className: "shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline",
              id: "signin-password",
              name: "password",
              type: "password",
              placeholder: "******************"
            }
          )
        ] }),
        /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between", children: /* @__PURE__ */ jsx(
          "button",
          {
            className: "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline",
            type: "submit",
            children: "Sign Up"
          }
        ) }),
        /* @__PURE__ */ jsx("button", { onClick: toggleForm, className: "block text-gray-700 text-sm font-bold mb-2", children: "Already have an account? Sign In" })
      ]
    }
  ) }) : /* @__PURE__ */ jsx("div", { className: "modalContainer", children: /* @__PURE__ */ jsxs(
    "form",
    {
      onSubmit: handleSignIn,
      children: [
        /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
          /* @__PURE__ */ jsx(
            "label",
            {
              className: "block text-gray-700 text-sm font-bold mb-2",
              htmlFor: "signin-email",
              children: "Email:"
            }
          ),
          /* @__PURE__ */ jsx(
            "input",
            {
              className: "shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline",
              id: "signin-email",
              name: "email",
              type: "text",
              placeholder: "Email"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
          /* @__PURE__ */ jsx(
            "label",
            {
              className: "block text-gray-700 text-sm font-bold mb-2",
              htmlFor: "signin-password",
              children: "Password:"
            }
          ),
          /* @__PURE__ */ jsx(
            "input",
            {
              className: "shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline",
              id: "signin-password",
              name: "password",
              type: "password",
              placeholder: "******************"
            }
          )
        ] }),
        /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between", children: /* @__PURE__ */ jsx(
          "button",
          {
            className: "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline",
            type: "submit",
            children: "Sign In"
          }
        ) }),
        /* @__PURE__ */ jsx("button", { onClick: toggleForm, className: "block text-gray-700 text-sm font-bold mb-2", children: "Don't have an account? Sign Up" })
      ]
    }
  ) });
};

// src/components/buttonSignIn/index.tsx
import React2 from "react";
import { jsx as jsx2, jsxs as jsxs2 } from "react/jsx-runtime";
var ButtonSignIn = () => {
  const [activeTab, setactiveTab] = React2.useState(false);
  const handleTabClick = () => {
    setactiveTab(true);
  };
  return /* @__PURE__ */ jsxs2("div", { className: styles_default.modalContainer, children: [
    activeTab && /* @__PURE__ */ jsx2(SignInForm, {}),
    /* @__PURE__ */ jsx2("h6", {}),
    /* @__PURE__ */ jsx2(
      "button",
      {
        className: "text-white font-bold py-2 px-4 rounded button-tba-main-2",
        onClick: () => {
          handleTabClick();
        },
        style: {
          marginLeft: "25px"
          // marginRight:'3px'
        },
        children: "Login with Dippi.."
      }
    )
  ] });
};
var buttonSignIn_default = ButtonSignIn;

// src/index.tsx
import { jsx as jsx3, jsxs as jsxs3 } from "react/jsx-runtime";
var ExampleComponent = ({ text }) => {
  return /* @__PURE__ */ jsxs3("div", { className: styles_default.test, children: [
    "Example Component: ",
    text
  ] });
};
var SignInComponent = () => {
  return /* @__PURE__ */ jsx3(SignInForm, {});
};
export {
  buttonSignIn_default as ButtonSignIn,
  ExampleComponent,
  SignInComponent
};
