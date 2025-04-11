import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CopyToClipboard } from 'react-copy-to-clipboard';

function ElectionCommitteeRole() {
  // Positions state with proper initialization
  const [positions, setPositions] = useState([]);
  const [loadingPositions, setLoadingPositions] = useState(true);
  const [positionError, setPositionError] = useState(null);

  // New position form
  const [newPosition, setNewPosition] = useState({ 
    title: '', 
    description: '' 
  });
  const [isAddingPosition, setIsAddingPosition] = useState(false);
  const [editPositionId, setEditPositionId] = useState(null);

  // Link generation
  const [showDateModal, setShowDateModal] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [linkType, setLinkType] = useState('');
  const [generatedLink, setGeneratedLink] = useState('');
  const [isLinkCopied, setIsLinkCopied] = useState(false);

  // Election statistics
  const [votes, setVotes] = useState({});
  const [totalVoters, setTotalVoters] = useState(0);
  const [votersParticipated, setVotersParticipated] = useState(0);
  const [loadingStats, setLoadingStats] = useState(true);

  // Load initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch positions
        const positionsResponse = await axios.get('/api/positions');
        setPositions(Array.isArray(positionsResponse?.data) ? positionsResponse.data : []);
        
        // Fetch election stats
        const statsResponse = await axios.get('/api/election/stats');
        setVotes(statsResponse.data.votes || {});
        setTotalVoters(statsResponse.data.totalVoters || 0);
        setVotersParticipated(statsResponse.data.votersParticipated || 0);
      } catch (error) {
        setPositionError('Failed to load data. Please try again later.');
        console.error('Error fetching data:', error);
        // Ensure fallback empty states
        setPositions([]);
        setVotes({});
      } finally {
        setLoadingPositions(false);
        setLoadingStats(false);
      }
    };

    fetchData();
  }, []);

  // Close modal when pressing Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setShowDateModal(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handlePositionChange = (e) => {
    const { name, value } = e.target;
    setNewPosition({ ...newPosition, [name]: value });
  };

  const validatePosition = () => {
    if (!newPosition.title.trim()) {
      alert('Position title is required');
      return false;
    }
    if (newPosition.title.length > 50) {
      alert('Title must be less than 50 characters');
      return false;
    }
    if (!newPosition.description.trim()) {
      alert('Position description is required');
      return false;
    }
    if (newPosition.description.length > 200) {
      alert('Description must be less than 200 characters');
      return false;
    }
    return true;
  };

  const handleAddPosition = async () => {
    if (!validatePosition()) return;

    try {
      setLoadingPositions(true);
      const response = await axios.post('/api/positions', newPosition);
      setPositions(prev => [...prev, response.data]);
      setNewPosition({ title: '', description: '' });
      setIsAddingPosition(false);
    } catch (error) {
      alert('Failed to add position. Please try again.');
      console.error('Error adding position:', error);
    } finally {
      setLoadingPositions(false);
    }
  };

  const handleUpdatePosition = async () => {
    if (!validatePosition()) return;

    try {
      setLoadingPositions(true);
      const response = await axios.put(`/api/positions/${editPositionId}`, newPosition);
      setPositions(prev => prev.map(pos => 
        pos.id === editPositionId ? response.data : pos
      ));
      setNewPosition({ title: '', description: '' });
      setEditPositionId(null);
    } catch (error) {
      alert('Failed to update position. Please try again.');
      console.error('Error updating position:', error);
    } finally {
      setLoadingPositions(false);
    }
  };

  const handleDeletePosition = async (id) => {
    if (!window.confirm('Are you sure you want to delete this position?')) return;

    try {
      setLoadingPositions(true);
      await axios.delete(`/api/positions/${id}`);
      setPositions(prev => prev.filter(pos => pos.id !== id));
    } catch (error) {
      alert('Failed to delete position. Please try again.');
      console.error('Error deleting position:', error);
    } finally {
      setLoadingPositions(false);
    }
  };

  const startEditing = (position) => {
    setNewPosition({
      title: position.title,
      description: position.description
    });
    setEditPositionId(position.id);
  };

  const cancelEditing = () => {
    setNewPosition({ title: '', description: '' });
    setEditPositionId(null);
    setIsAddingPosition(false);
  };

  const handleGenerateLink = () => {
    const now = new Date();

    if (!startDate || !endDate || !linkType) {
      alert('Please specify the date/time and link type!');
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start < now) {
      alert("Start date/time can't be in the past.");
      return;
    }

    if (end <= start) {
      alert('End date/time must be after the start date/time.');
      return;
    }

    const startDateTime = start.toISOString();
    const endDateTime = end.toISOString();

    let link = '';
    if (linkType === 'voter') {
      link = `${window.location.origin}/register?start=${encodeURIComponent(startDateTime)}&end=${encodeURIComponent(endDateTime)}`;
    } else if (linkType === 'nominate') {
      link = `${window.location.origin}/nominate?start=${encodeURIComponent(startDateTime)}&end=${encodeURIComponent(endDateTime)}`;
    } else if (linkType === 'vote') {
      link = `${window.location.origin}/vote?start=${encodeURIComponent(startDateTime)}&end=${encodeURIComponent(endDateTime)}`;
    }

    setGeneratedLink(link);
    setShowDateModal(false);
  };

  const refreshResults = async () => {
    try {
      setLoadingStats(true);
      const response = await axios.get('/api/election/stats');
      setVotes(response.data.votes || {});
      setTotalVoters(response.data.totalVoters || 0);
      setVotersParticipated(response.data.votersParticipated || 0);
    } catch (error) {
      console.error('Error refreshing stats:', error);
    } finally {
      setLoadingStats(false);
    }
  };

  const calculateParticipationPercentage = () => {
    return totalVoters > 0 
      ? ((votersParticipated / totalVoters) * 100).toFixed(2)
      : '0.00';
  };

  const getPositionVotes = (positionTitle) => {
    return votes[positionTitle] || 0;
  };

  return (
    <div className="container mx-auto p-6 lg:px-12 lg:max-w-screen-lg">
      <h1 className="text-3xl font-bold text-center mb-8">Election Committee Dashboard</h1>

      {positionError && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
          {positionError}
        </div>
      )}

      {/* Manage Election Positions */}
      <section className="space-y-6 mb-12">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Manage Election Positions</h2>
        </div>

        {loadingPositions ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {positions.length === 0 && !isAddingPosition ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">No positions available</p>
                <button
                  onClick={() => setIsAddingPosition(true)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                >
                  Add Position
                </button>
              </div>
            ) : (
              <>
                {positions.map((position) => (
                  <div key={position.id} className="border p-4 rounded-md shadow-lg space-y-2">
                    {editPositionId === position.id ? (
                      <>
                        <input
                          type="text"
                          name="title"
                          value={newPosition.title}
                          onChange={handlePositionChange}
                          className="w-full p-2 border rounded-md font-semibold"
                          placeholder="Position Title"
                          maxLength={50}
                        />
                        <textarea
                          name="description"
                          value={newPosition.description}
                          onChange={handlePositionChange}
                          className="w-full p-2 border rounded-md"
                          rows="3"
                          placeholder="Position Description"
                          maxLength={200}
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={handleUpdatePosition}
                            className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                          >
                            Save
                          </button>
                          <button
                            onClick={cancelEditing}
                            className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
                          >
                            Cancel
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <h3 className="font-semibold text-lg">{position.title}</h3>
                        <p className="text-gray-700">{position.description}</p>
                        <div className="flex gap-2 pt-2">
                          <button
                            onClick={() => startEditing(position)}
                            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeletePosition(position.id)}
                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                          >
                            Delete
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}

                {isAddingPosition && (
                  <div className="mt-4 border p-4 rounded-md shadow-lg">
                    <h3 className="font-semibold text-lg mb-2">Add New Position</h3>
                    <div className="space-y-4">
                      <input
                        type="text"
                        name="title"
                        placeholder="Position Title (max 50 chars)"
                        value={newPosition.title}
                        onChange={handlePositionChange}
                        className="w-full p-2 border rounded-md"
                        maxLength={50}
                      />
                      <textarea
                        name="description"
                        placeholder="Position Description (max 200 chars)"
                        value={newPosition.description}
                        onChange={handlePositionChange}
                        className="w-full p-2 border rounded-md"
                        rows="4"
                        maxLength={200}
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={handleAddPosition}
                          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                        >
                          Save Position
                        </button>
                        <button
                          onClick={cancelEditing}
                          className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </section>

      {/* Link Generation */}
      <section className="space-y-6 mb-12">
        <h2 className="text-2xl font-semibold">Link Generation & Management</h2>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => {
                setShowDateModal(true);
                setLinkType('voter');
              }}
              className="bg-blue-500 text-white px-4 py-3 rounded-md hover:bg-blue-600 flex flex-col items-center"
            >
              <span className="font-medium">Voter Registration</span>
              <span className="text-sm opacity-80">Generate Link</span>
            </button>
            <button
              onClick={() => {
                setShowDateModal(true);
                setLinkType('nominate');
              }}
              className="bg-blue-500 text-white px-4 py-3 rounded-md hover:bg-blue-600 flex flex-col items-center"
            >
              <span className="font-medium">Candidate Nomination</span>
              <span className="text-sm opacity-80">Generate Link</span>
            </button>
            <button
              onClick={() => {
                setShowDateModal(true);
                setLinkType('vote');
              }}
              className="bg-blue-500 text-white px-4 py-3 rounded-md hover:bg-blue-600 flex flex-col items-center"
            >
              <span className="font-medium">Voting Portal</span>
              <span className="text-sm opacity-80">Generate Link</span>
            </button>
          </div>

          {/* Modal for Date/Time Inputs */}
          {showDateModal && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center p-4 z-50">
              <div 
                className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full"
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-title"
              >
                <h3 id="modal-title" className="text-xl font-semibold mb-4">
                  Generate {linkType === 'voter' ? 'Voter Registration' : 
                           linkType === 'nominate' ? 'Candidate Nomination' : 'Voting'} Link
                </h3>

                <div className="mb-4">
                  <label htmlFor="startDate" className="block text-lg mb-1">Start Date/Time*</label>
                  <input
                    type="datetime-local"
                    id="startDate"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full p-2 border rounded-md"
                    min={new Date().toISOString().slice(0, 16)}
                    required
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="endDate" className="block text-lg mb-1">End Date/Time*</label>
                  <input
                    type="datetime-local"
                    id="endDate"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full p-2 border rounded-md"
                    min={startDate || new Date().toISOString().slice(0, 16)}
                    required
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleGenerateLink}
                    className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 flex-1"
                  >
                    Generate Link
                  </button>
                  <button
                    onClick={() => setShowDateModal(false)}
                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 flex-1"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {generatedLink && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <p className="font-semibold">Generated Link:</p>
                <CopyToClipboard 
                  text={generatedLink}
                  onCopy={() => {
                    setIsLinkCopied(true);
                    setTimeout(() => setIsLinkCopied(false), 2000);
                  }}
                >
                  <button className="bg-blue-100 text-blue-600 px-3 py-1 rounded text-sm hover:bg-blue-200">
                    {isLinkCopied ? 'Copied!' : 'Copy Link'}
                  </button>
                </CopyToClipboard>
              </div>
              <a
                href={generatedLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline break-all block p-2 bg-white rounded border"
              >
                {generatedLink}
              </a>
              <p className="text-sm text-gray-500 mt-2">
                This link will be active between {new Date(startDate).toLocaleString()} and {new Date(endDate).toLocaleString()}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Election Statistics */}
      <section className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Election Statistics</h2>
          <button
            onClick={refreshResults}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 flex items-center"
            disabled={loadingStats}
          >
            {loadingStats ? (
              <>
                <span className="inline-block animate-spin mr-2">↻</span>
                Refreshing...
              </>
            ) : (
              <>
                <span className="mr-2">↻</span>
                Refresh
              </>
            )}
          </button>
        </div>

        {loadingStats ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Participation Stats */}
            <div className="border p-4 rounded-lg shadow">
              <h3 className="font-semibold text-lg mb-4">Voter Participation</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-gray-600">Total Registered Voters</p>
                  <p className="text-2xl font-bold">{totalVoters}</p>
                </div>
                <div>
                  <p className="text-gray-600">Voters Participated</p>
                  <p className="text-2xl font-bold">{votersParticipated}</p>
                </div>
                <div>
                  <p className="text-gray-600">Participation Percentage</p>
                  <div className="w-full bg-gray-200 rounded-full h-4 mt-2">
                    <div 
                      className="bg-blue-500 h-4 rounded-full" 
                      style={{ width: `${calculateParticipationPercentage()}%` }}
                    ></div>
                  </div>
                  <p className="text-xl font-bold mt-1">{calculateParticipationPercentage()}%</p>
                </div>
              </div>
            </div>

            {/* Position-wise Results */}
            <div className="border p-4 rounded-lg shadow">
              <h3 className="font-semibold text-lg mb-4">Position-wise Results</h3>
              <div className="space-y-4">
                {positions.length > 0 ? (
                  positions.map(position => (
                    <div key={position.id} className="border-b pb-3 last:border-b-0">
                      <p className="font-medium">{position.title}</p>
                      <div className="flex items-center mt-1">
                        <span className="text-gray-600 mr-2">Votes:</span>
                        <span className="font-bold">{getPositionVotes(position.title)}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No positions available</p>
                )}
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

export default ElectionCommitteeRole;