import React from 'react';

const communities = [
  {
    name: 'Bali Trip 2027',
    members: 42,
    image: 'https://via.placeholder.com/50',
  },
  {
    name: 'PC Build Club',
    members: 19,
    image: 'https://via.placeholder.com/50',
  },
  {
    name: 'GTA 6 Preppers',
    members: 30,
    image: 'https://via.placeholder.com/50',
  },
];

const CommunityList = () => {
  return (
    <div className="bg-white p-4 rounded-xl shadow-md space-y-3">
      <h4 className="text-lg font-semibold text-blue-600">Communities</h4>
      {communities.map((community, idx) => (
        <div
          key={idx}
          className="flex justify-between items-center bg-gray-100 px-3 py-2 rounded-lg"
        >
          <div className="flex items-center space-x-3">
            <img
              src={community.image}
              alt={community.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <h5 className="font-medium text-gray-700 text-sm">
                {community.name}
              </h5>
              <p className="text-xs text-gray-500">
                {community.members} members
              </p>
            </div>
          </div>
          <button className="text-xs bg-green-500 text-white px-2 py-1 rounded-full hover:bg-green-600">
            Join
          </button>
        </div>
      ))}
    </div>
  );
};

export default CommunityList;
