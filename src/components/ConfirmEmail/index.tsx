import React from 'react';
import { ConfirmEmailProps } from '../../interfaces/users.interface';


const ConfirmEmail = (props: ConfirmEmailProps) => {
    return (
        <div
            className="grid modalContainer max-h-[620px]"
            style={{ backgroundImage: `url(/assets/img/wallpaper.png)` }}
        >
            <button
                className="bg-[#47b0bf] hover:bg-[#69d1e0] text-white font-bold px-2 rounded"
                style={{
                    position: 'absolute',
                    top: '4px',
                    right: '5px',
                    cursor: 'pointer',
                }}
            >
                x
            </button>
            <div className="flex items-center justify-center mt-6">
                <div className="w-full max-w-[320px]">
                    <div className="grid min-h-screen pb-14" style={{ paddingLeft: '15px', paddingRight: '15px' }}>
                        <div className="flex justify-center">
                            <div className="pb-14">
                                <div className="img-modal flex justify-center mb-4">
                                    <img
                                        alt="Dippi"
                                        src="https://app.dippi.xyz/assets/img/logo-beta.png"
                                        width={100}
                                        height={100}
                                    />
                                </div>
                                <h1
                                    className="mb-6 text-4xl text-center"
                                    style={{ fontWeight: 600 }}
                                >
                                    Sign Up
                                </h1>
                                {
                                    !props.success ?
                                        <div className="relative flex flex-col overflow-hidden bg-white">
                                            <div className="max-w-xl px-5 text-center">
                                                <h2 className="mb-2 text-[42px] font-bold text-zinc-800">Check your inbox</h2>
                                                <p className="mb-2 text-lg text-zinc-500">We are glad, that you’re with us ? We’ve sent you a verification link to the email address <span className="font-medium text-[#47B0BF]">mail@yourdomain.com</span>.</p>
                                                <div className="mt-3 inline-block rounded-full bg-[#47B0BF] p-3">
                                                    <div className="w-6 h-6 border-t-2 border-white border-solid rounded-full animate-spin spin-animation"></div>
                                                </div>
                                            </div>
                                        </div>
                                        :
                                        <div className="relative flex flex-col overflow-hidden bg-white">
                                            <div className="max-w-xl px-5 text-center">
                                                <h2 className="mb-2 text-[42px] font-bold text-zinc-800">Check your inbox</h2>
                                                <p className="mb-2 text-lg text-zinc-500">We are glad, that you’re with us ? We’ve sent you a verification link to the email address <span className="font-medium text-[#47B0BF]">mail@yourdomain.com</span>.</p>
                                                <svg viewBox="0 0 24 24" className="text-green-600 w-16 h-16 mx-auto my-6">
                                                    <path fill="currentColor"
                                                        d="M12,0A12,12,0,1,0,24,12,12.014,12.014,0,0,0,12,0Zm6.927,8.2-6.845,9.289a1.011,1.011,0,0,1-1.43.188L5.764,13.769a1,1,0,1,1,1.25-1.562l4.076,3.261,6.227-8.451A1,1,0,1,1,18.927,8.2Z">
                                                    </path>
                                                </svg>
                                            </div>
                                        </div>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
}

export default ConfirmEmail;
