"use client";

import { useState } from "react";

export default function LoginOrderPopup() {
  const [showPopup, setShowPopup] = useState(false);

  const handleLoginClick = () => {
    setShowPopup(true);
  };

  return (
    <>
      <button
        onClick={handleLoginClick}
        className="rounded-md bg-white text-[#556B2F] px-4 py-2 font-medium"
      >
        Login
      </button>

      {showPopup && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl">
            <h3 className="text-xl font-bold text-[#556B2F] mb-2">Welcome!</h3>
            <p className="text-gray-700 mb-4">
              Trouble placing your order online? We can help you complete it quickly.
            </p>
            <button
              onClick={() => setShowPopup(false)}
              className="rounded-md bg-[#556B2F] text-white px-4 py-2"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}