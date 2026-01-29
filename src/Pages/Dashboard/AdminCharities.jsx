import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { FaBuilding, FaCheckCircle, FaSearch, FaEye } from 'react-icons/fa';
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
      const allCampaigns = await getCampaigns();
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

        if (campaign.status === 'approved') charityMap[campaign.charityId].approvedCampaigns++;
        else if (campaign.status === 'pending') charityMap[campaign.charityId].pendingCampaigns++;
        else if (campaign.status === 'rejected') charityMap[campaign.charityId].rejectedCampaigns++;
      });

      setCharities(Object.values(charityMap));
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const filteredCharities = charities.filter(charity =>
    charity.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <>
      <Helmet>
        <title>Admin Charities - Charity Platform</title>
      </Helmet>

      {/* Page Background */}
      <div className="space-y-6 p-4 rounded-3xl bg-black/70 backdrop-blur">

        {/* Header */}
        <div className="flex items-center justify-between p-5 rounded-2xl bg-black/80 text-white backdrop-blur shadow-lg">
          <div className="flex items-center gap-3">
            <FaBuilding className="text-2xl opacity-90" />
            <h1 className="text-2xl font-semibold">Charities Management</h1>
          </div>

          <div className="join">
            <input
              type="text"
              placeholder="Search charities..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="input join-item w-72 bg-black/60 text-white placeholder:text-gray-400 border border-white/20"
            />
            <button className="btn join-item bg-white/10 hover:bg-white/20 text-white border-none">
              <FaSearch />
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="stats shadow-lg rounded-2xl bg-black/60 backdrop-blur border border-white/10 text-white">
          <div className="stat">
            <div className="stat-title text-gray-400">Total Charities</div>
            <div className="stat-value">{charities.length}</div>
            <div className="stat-desc text-gray-500">Registered organizations</div>
          </div>

          <div className="stat">
            <div className="stat-title text-gray-400">Total Campaigns</div>
            <div className="stat-value">
              {charities.reduce((s, c) => s + c.totalCampaigns, 0)}
            </div>
            <div className="stat-desc text-gray-500">All campaigns combined</div>
          </div>

          <div className="stat">
            <div className="stat-title text-gray-400">Total Raised</div>
            <div className="stat-value">
              ৳{charities.reduce((s, c) => s + c.totalRaised, 0).toLocaleString()}
            </div>
            <div className="stat-desc text-gray-500">Across all charities</div>
          </div>
        </div>

        {/* Table */}
        <div className="card rounded-2xl shadow-lg bg-black/70 backdrop-blur border border-white/10 text-white">
          <div className="card-body p-0">

            {loading ? (
              <div className="p-10 text-center">
                <span className="loading loading-spinner loading-lg text-white"></span>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="table">
                  <thead>
                    <tr className="bg-black/80 text-white">
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
                      <tr key={charity.id} className="hover:bg-white/10">
                        <td>{idx + 1}</td>

                        <td>
                          <div className="flex items-center gap-3">
                            <div className="avatar placeholder">
                              <div className="bg-white/10 text-white rounded-full w-10">
                                <span>{charity.name.charAt(0)}</span>
                              </div>
                            </div>
                            <div>
                              <div className="font-semibold">{charity.name}</div>
                              <div className="text-xs flex items-center gap-1 text-green-400">
                                <FaCheckCircle /> Registered
                              </div>
                            </div>
                          </div>
                        </td>

                        <td><span className="badge bg-white/10 text-white">{charity.totalCampaigns}</span></td>
                        <td><span className="badge bg-white/10 text-white">{charity.approvedCampaigns}</span></td>
                        <td><span className="badge bg-white/10 text-white">{charity.pendingCampaigns}</span></td>
                        <td className="font-semibold">৳{charity.totalRaised.toLocaleString()}</td>

                        <td>
                          <Link
                            to={`/campaigns?charity=${charity.id}`}
                            className="btn btn-sm btn-ghost text-white hover:bg-white/10"
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
