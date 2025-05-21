import React from 'react';

const CommunityPost = () => {
  return (
    <div className="bg-white p-5 rounded-xl shadow-md space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold text-gray-700">Bali Trip 2027</h3>
          <p className="text-sm text-gray-500">Goal Progress: 60%</p>
        </div>
        <img
          src="https://via.placeholder.com/60"
          alt="Bali Trip"
          className="rounded-xl w-16 h-16 object-cover"
        />
      </div>

      <p className="text-sm text-gray-600">
        Just booked our accommodation! 🌴 Can't wait to hit the beach. Anyone
        else saving for Bali?
      </p>

      <div className="flex justify-between text-sm text-gray-500">
        <span>24 Comments</span>
        <span className="text-blue-500 font-medium cursor-pointer">Join</span>
      </div>
    </div>
  );
};

export default CommunityPost;
