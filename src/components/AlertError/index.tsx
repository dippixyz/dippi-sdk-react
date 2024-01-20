import React from 'react';

interface AlertBoxProps {
    title: string;
    message: string;
}

function AlertError({ title, message }: AlertBoxProps) {
    return (
        <div role="alert" className='mt-2 mb-2'>
            <div className="bg-red-500 text-white font-bold rounded-t px-4 py-2 text-sm">
                {title}
            </div>
            <div className="border border-t-0 border-red-400 rounded-b bg-red-100 px-4 py-3 text-red-700 text-sm">
                <p>{message}</p>
            </div>
        </div>
    );
}

export default AlertError;
