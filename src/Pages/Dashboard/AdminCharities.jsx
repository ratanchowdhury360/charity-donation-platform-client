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

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FaBuilding className="text-2xl text-primary" />
            <h1 className="text-2xl font-bold">Charities</h1>
          </div>
          <div className="join">
            <input
              type="text"
              placeholder="Search charities..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="input input-bordered join-item w-72"
            />
            <button className="btn btn-primary join-item">
              <FaSearch />
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="stats shadow-lg bg-gradient-to-br from-white via-primary/5 to-secondary/5 border-2 border-primary/20 w-full">
          <div className="stat bg-gradient-to-br from-primary/10 to-primary/5 border-r-2 border-primary/20">
            <div className="stat-title text-gray-700 font-semibold">Total Charities</div>
            <div className="stat-value text-primary">{charities.length}</div>
            <div className="stat-desc text-gray-600">Registered organizations</div>
          </div>
          <div className="stat bg-gradient-to-br from-secondary/10 to-secondary/5 border-r-2 border-secondary/20">
            <div className="stat-title text-gray-700 font-semibold">Total Campaigns</div>
            <div className="stat-value text-secondary">
              {charities.reduce((sum, c) => sum + c.totalCampaigns, 0)}
            </div>
            <div className="stat-desc text-gray-600">All campaigns combined</div>
          </div>
          <div className="stat bg-gradient-to-br from-accent/10 to-accent/5">
            <div className="stat-title text-gray-700 font-semibold">Total Raised</div>
            <div className="stat-value text-accent">
              ৳{charities.reduce((sum, c) => sum + c.totalRaised, 0).toLocaleString()}
            </div>
            <div className="stat-desc text-gray-600">Across all charities</div>
          </div>
        </div>

        {/* Charities List */}
        <div className="card bg-gradient-to-br from-white via-primary/10 to-secondary/10 shadow-xl border-2 border-primary/20">
          <div className="card-body p-0">
            {loading ? (
              <div className="p-6 text-center">
                <span className="loading loading-spinner loading-lg"></span>
              </div>
            ) : filteredCharities.length === 0 ? (
              <div className="p-12 text-center">
                <FaBuilding className="text-6xl text-base-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">No Charities Found</h3>
                <p className="text-base-content/70">
                  {searchText ? 'Try a different search term' : 'No charities have registered yet'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Charity Name</th>
                      <th>Total Campaigns</th>
                      <th>Approved</th>
                      <th>Pending</th>
                      <th>Total Raised</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCharities.map((charity, idx) => (
                      <tr key={charity.id} className="hover">
                        <td>{idx + 1}</td>
                        <td>
                          <div className="flex items-center gap-3">
                            <div className="avatar placeholder">
                              <div className="bg-primary text-primary-content rounded-full w-10">
                                <span className="text-lg">{charity.name.charAt(0).toUpperCase()}</span>
                              </div>
                            </div>
                            <div>
                              <div className="font-bold">{charity.name}</div>
                              <div className="text-xs flex items-center gap-1 text-success">
                                <FaCheckCircle />
                                <span>Registered</span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="badge badge-lg">{charity.totalCampaigns}</span>
                        </td>
                        <td>
                          <span className="badge badge-success badge-lg">{charity.approvedCampaigns}</span>
                        </td>
                        <td>
                          <span className="badge badge-warning badge-lg">{charity.pendingCampaigns}</span>
                        </td>
                        <td>
                          <span className="font-bold text-secondary">৳{charity.totalRaised.toLocaleString()}</span>
                        </td>
                        <td>
                          <Link
                            to={`/campaigns?charity=${charity.id}`}
                            className="btn btn-sm btn-ghost"
                            title="View campaigns"
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
