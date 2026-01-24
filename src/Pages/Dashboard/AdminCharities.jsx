import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { FaBuilding, FaHeart, FaCheckCircle, FaSearch, FaEye } from 'react-icons/fa';
import { getCampaigns } from '../../utils/campaignStorage';

const AdminCharities = () => {
  const [charities, setCharities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    fetchCharities();
  }, []);

  const fetchCharities = async () => {
    try {
      // Get all campaigns and group by charity
      const allCampaigns = await getCampaigns();
      
      // Group campaigns by charityId
      const charityMap = {};
      
      allCampaigns.forEach(campaign => {
        if (!charityMap[campaign.charityId]) {
          charityMap[campaign.charityId] = {
            id: campaign.charityId,
            name: campaign.charityName,
            campaigns: [],
            totalRaised: 0,
            totalCampaigns: 0,
            approvedCampaigns: 0,
            pendingCampaigns: 0,
            rejectedCampaigns: 0
          };
        }
        
        charityMap[campaign.charityId].campaigns.push(campaign);
        charityMap[campaign.charityId].totalCampaigns++;
        charityMap[campaign.charityId].totalRaised += campaign.currentAmount || 0;
        
        if (campaign.status === 'approved') {
          charityMap[campaign.charityId].approvedCampaigns++;
        } else if (campaign.status === 'pending') {
          charityMap[campaign.charityId].pendingCampaigns++;
        } else if (campaign.status === 'rejected') {
          charityMap[campaign.charityId].rejectedCampaigns++;
        }
      });
      
      // Convert to array and sort by total raised
      const charitiesArray = Object.values(charityMap).sort((a, b) => b.totalRaised - a.totalRaised);
      setCharities(charitiesArray);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching charities:', error);
      setLoading(false);
    }
  };

  const filteredCharities = charities.filter(charity => {
    const search = searchText.toLowerCase();
    return !search || charity.name.toLowerCase().includes(search);
  });

  return (
 <>
  <Helmet>
    <title>Admin Charities - Charity Platform</title>
  </Helmet>

  {/* Page Background */}
  <div className="space-y-6 p-4 rounded-3xl bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50">

    {/* Header */}
    <div className="flex items-center justify-between p-5 rounded-2xl 
      bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 
      text-white shadow-lg">

      <div className="flex items-center gap-3">
        <FaBuilding className="text-2xl opacity-90" />
        <h1 className="text-2xl font-semibold tracking-wide">
          Charities Management
        </h1>
      </div>

      <div className="join">
        <input
          type="text"
          placeholder="Search charities..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="input join-item w-72 bg-white/90 text-gray-800 placeholder:text-gray-400"
        />
        <button className="btn join-item bg-white/20 hover:bg-white/30 text-white border-none">
          <FaSearch />
        </button>
      </div>
    </div>

    {/* Stats Overview */}
    <div className="stats shadow-lg rounded-2xl 
      bg-white/80 backdrop-blur border border-indigo-100">

      <div className="stat">
        <div className="stat-title text-gray-500">Total Charities</div>
        <div className="stat-value text-indigo-600">
          {charities.length}
        </div>
        <div className="stat-desc text-gray-400">
          Registered organizations
        </div>
      </div>

      <div className="stat">
        <div className="stat-title text-gray-500">Total Campaigns</div>
        <div className="stat-value text-blue-600">
          {charities.reduce((sum, c) => sum + c.totalCampaigns, 0)}
        </div>
        <div className="stat-desc text-gray-400">
          All campaigns combined
        </div>
      </div>

      <div className="stat">
        <div className="stat-title text-gray-500">Total Raised</div>
        <div className="stat-value text-purple-600">
          ৳{charities.reduce((sum, c) => sum + c.totalRaised, 0).toLocaleString()}
        </div>
        <div className="stat-desc text-gray-400">
          Across all charities
        </div>
      </div>

    </div>

    {/* Charities Table */}
    <div className="card rounded-2xl shadow-lg 
      bg-white/90 backdrop-blur border border-indigo-100">
      <div className="card-body p-0">

        {loading ? (
          <div className="p-10 text-center">
            <span className="loading loading-spinner loading-lg text-indigo-600"></span>
          </div>
        ) : filteredCharities.length === 0 ? (
          <div className="p-12 text-center">
            <FaBuilding className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              No Charities Found
            </h3>
            <p className="text-gray-500">
              {searchText
                ? "Try a different search term"
                : "No charities have registered yet"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table">

              <thead>
                <tr className="bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700">
                  <th>#</th>
                  <th>Charity</th>
                  <th>Campaigns</th>
                  <th>Approved</th>
                  <th>Pending</th>
                  <th>Total Raised</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredCharities.map((charity, idx) => (
                  <tr
                    key={charity.id}
                    className="hover:bg-indigo-50 transition-colors"
                  >
                    <td className="font-medium text-indigo-600">
                      {idx + 1}
                    </td>

                    <td>
                      <div className="flex items-center gap-3">
                        <div className="avatar placeholder">
                          <div className="bg-indigo-100 text-indigo-700 rounded-full w-10">
                            <span className="font-semibold">
                              {charity.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        </div>

                        <div>
                          <div className="font-semibold text-gray-800">
                            {charity.name}
                          </div>
                          <div className="text-xs flex items-center gap-1 text-green-600">
                            <FaCheckCircle />
                            <span>Registered</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span className="badge bg-blue-100 text-blue-700">
                        {charity.totalCampaigns}
                      </span>
                    </td>

                    <td>
                      <span className="badge bg-green-100 text-green-700">
                        {charity.approvedCampaigns}
                      </span>
                    </td>

                    <td>
                      <span className="badge bg-yellow-100 text-yellow-700">
                        {charity.pendingCampaigns}
                      </span>
                    </td>

                    <td className="font-semibold text-purple-600">
                      ৳{charity.totalRaised.toLocaleString()}
                    </td>

                    <td>
                      <Link
                        to={`/campaigns?charity=${charity.id}`}
                        className="btn btn-sm btn-ghost text-indigo-600 hover:bg-indigo-100"
                      >
                        <FaEye />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        )}
      </div>
    </div>

  </div>
</>


  );
};

export default AdminCharities;
