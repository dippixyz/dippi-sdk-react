// import { useState } from 'react';
import React from 'react';
export const Collapsible = ({ title, body = false }: any) => {
    // const [isCollapsed, setIsCollapsed] = useState(collapsed);
    
    return (
        <div className="m-4 rounded-xl border-2 border-gray-100">
            {/* <h6> test 1111111asldalsdla</h6> */}
            <div
                className={`p-4 ${
                    true && 'border-b-2'
                } border-b-gray-100 cursor-pointer hover:bg-gray-100 transition-colors duration-200 ease-in-out flex justify-between`}
                // onClick={() => setIsCollapsed(true)}
            >
                <span>
                    <strong>{title}</strong>
                </span>
                <span>{true ? '▼' : '▲'}</span>
            </div>
            {true && <div className="p-4">{body}</div>}
        </div>
    );
};

export default Collapsible;
