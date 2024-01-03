"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.tsx
var src_exports = {};
__export(src_exports, {
  ButtonSignIn: () => buttonSignIn_default,
  ExampleComponent: () => ExampleComponent,
  SignInComponent: () => SignInComponent
});
module.exports = __toCommonJS(src_exports);

// src/styles.module.css
var styles_default = {};

// src/components/SignIn/index.tsx
var import_react = require("react");
var import_jsx_runtime = require("react/jsx-runtime");
var SignInForm = () => {
  const [showSignUp, setShowSignUp] = (0, import_react.useState)(false);
  const toggleForm = () => setShowSignUp(!showSignUp);
  const handleSignIn = (e) => {
    e.preventDefault();
  };
  const handleSignUp = (e) => {
    e.preventDefault();
  };
  return showSignUp ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "modalContainer", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
    "form",
    {
      onSubmit: handleSignUp,
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "mb-4", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            "label",
            {
              className: "block text-gray-700 text-sm font-bold mb-2",
              htmlFor: "signin-email",
              children: "Email:"
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
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
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "mb-4", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            "label",
            {
              className: "block text-gray-700 text-sm font-bold mb-2",
              htmlFor: "signin-password",
              children: "Password:"
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
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
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "flex items-center justify-between", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          "button",
          {
            className: "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline",
            type: "submit",
            children: "Sign Up"
          }
        ) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { onClick: toggleForm, className: "block text-gray-700 text-sm font-bold mb-2", children: "Already have an account? Sign In" })
      ]
    }
  ) }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "modalContainer", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
    "form",
    {
      onSubmit: handleSignIn,
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "mb-4", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            "label",
            {
              className: "block text-gray-700 text-sm font-bold mb-2",
              htmlFor: "signin-email",
              children: "Email:"
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
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
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "mb-4", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            "label",
            {
              className: "block text-gray-700 text-sm font-bold mb-2",
              htmlFor: "signin-password",
              children: "Password:"
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
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
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "flex items-center justify-between", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          "button",
          {
            className: "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline",
            type: "submit",
            children: "Sign In"
          }
        ) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { onClick: toggleForm, className: "block text-gray-700 text-sm font-bold mb-2", children: "Don't have an account? Sign Up" })
      ]
    }
  ) });
};

// src/components/buttonSignIn/index.tsx
var import_react2 = __toESM(require("react"));
var import_jsx_runtime2 = require("react/jsx-runtime");
var ButtonSignIn = () => {
  const [activeTab, setactiveTab] = import_react2.default.useState(false);
  const handleTabClick = () => {
    setactiveTab(true);
  };
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: styles_default.modalContainer, children: [
    activeTab && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(SignInForm, {}),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("h6", {}),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
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
var import_jsx_runtime3 = require("react/jsx-runtime");
var ExampleComponent = ({ text }) => {
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: styles_default.test, children: [
    "Example Component: ",
    text
  ] });
};
var SignInComponent = () => {
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(SignInForm, {});
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ButtonSignIn,
  ExampleComponent,
  SignInComponent
});
