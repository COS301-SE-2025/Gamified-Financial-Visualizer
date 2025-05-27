import React from 'react';

const CommunityInfo = ({ description, progress }) => {
  return (
    <div className="rounded-xl border p-4 bg-white shadow-sm">
      <div className="flex justify-between items-center">
        <div>
          <h4 className="font-semibold text-sm text-gray-700 mb-1">Community Description</h4>
          <p className="text-xs text-gray-500">{description}</p>
        </div>

        <div className="text-right">
          <h4 className="font-semibold text-sm text-gray-700 mb-1">Community Progress</h4>
          <div className="bg-gray-200 rounded-full h-3 w-48">
            <div
              className="h-3 rounded-full bg-lime-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-xs mt-1 text-lime-600 font-semibold">{progress}%</p>
          <button className="mt-2 px-4 py-1 bg-gray-200 rounded-full text-xs text-gray-700 shadow hover:bg-gray-300">
            Join
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommunityInfo;