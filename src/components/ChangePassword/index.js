"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChangePasswordForm = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const DippiProvider_1 = require("../DippiProvider");
require("../../output.css");
const ChangePasswordForm = ({ onClose }) => {
    const [oldPassword, setOldPassword] = (0, react_1.useState)('');
    const [password, setPassword] = (0, react_1.useState)('');
    const [repeatPassword, setRepeatPassword] = (0, react_1.useState)('');
    const [email, setEmail] = (0, react_1.useState)('');
    const { handlePasswordChange: handlePasswordChange_ } = (0, DippiProvider_1.useDippiContext)();
    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };
    const handleOldPasswordChange = (e) => {
        setOldPassword(e.target.value);
    };
    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };
    const handleRepeatPasswordChange = (e) => {
        setRepeatPassword(e.target.value);
    };
    const [showSignUp, setShowSignUp] = (0, react_1.useState)(false);
    const toggleForm = () => setShowSignUp(!showSignUp);
    return ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: (0, jsx_runtime_1.jsxs)("div", { className: "modalContainer", children: [(0, jsx_runtime_1.jsx)("button", { onClick: onClose, className: "bg-[#47b0bf] hover:bg-[#69d1e0] text-white font-bold py-2 px-4 rounded", style: {
                        position: 'absolute',
                        top: '5px',
                        right: '5px',
                        cursor: 'pointer',
                    }, children: "x" }), (0, jsx_runtime_1.jsxs)("form", { onSubmit: (e) => {
                        e.preventDefault();
                        // handleSignUp({ email, password });
                        handlePasswordChange_({ userEmail: email, oldPassword, password, repeatedPassword: repeatPassword });
                    }, children: [(0, jsx_runtime_1.jsxs)("div", { className: "mb-4", children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-gray-700 text-sm font-bold mb-2", htmlFor: "email", children: "Email:" }), (0, jsx_runtime_1.jsx)("input", { id: "signin-email", name: "email", type: "text", placeholder: "Email", onChange: handleEmailChange })] }), (0, jsx_runtime_1.jsxs)("div", { className: "mb-4", children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-gray-700 text-sm font-bold mb-2", htmlFor: "old-password", children: "Old Password:" }), (0, jsx_runtime_1.jsx)("input", { className: "shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline", id: "old-password", name: "oldPassword", type: "password", placeholder: "******************", onChange: handleOldPasswordChange })] }), (0, jsx_runtime_1.jsxs)("div", { className: "mb-4", children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-gray-700 text-sm font-bold mb-2", htmlFor: "signin-password", children: "New Password:" }), (0, jsx_runtime_1.jsx)("input", { className: "shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline", id: "signin-password", name: "password", type: "password", placeholder: "******************", onChange: handlePasswordChange })] }), (0, jsx_runtime_1.jsxs)("div", { className: "mb-4", children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-gray-700 text-sm font-bold mb-2", htmlFor: "repeat-password", children: "Repeat New Password:" }), (0, jsx_runtime_1.jsx)("input", { className: "shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline", id: "repeat-password", name: "repeatPassword", type: "password", placeholder: "******************", onChange: handleRepeatPasswordChange })] }), (0, jsx_runtime_1.jsx)("div", { className: "flex items-center justify-between", children: (0, jsx_runtime_1.jsx)("button", { className: "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline", type: "submit", children: "Change Password" }) }), (0, jsx_runtime_1.jsx)("button", { onClick: toggleForm, className: "block text-gray-700 text-sm font-bold mb-2", children: "Already have an account? Sign In" })] })] }) }));
};
exports.ChangePasswordForm = ChangePasswordForm;
exports.default = exports.ChangePasswordForm;
