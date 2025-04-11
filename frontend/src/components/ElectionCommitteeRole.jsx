import React, { useState } from 'react';

function ElectionCommitteeRole() {
  const [positions, setPositions] = useState([
    { id: 1, title: 'President', description: 'Leads the election process' },
    { id: 2, title: 'Treasurer', description: 'Manages the funds and accounts' },
  ]);

  const [newPosition, setNewPosition] = useState({ title: '', description: '' });
  const [isAddingPosition, setIsAddingPosition] = useState(false);

  const [showDateModal, setShowDateModal] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [linkType, setLinkType] = useState('');
  const [generatedLink, setGeneratedLink] = useState('');

  const [votes, setVotes] = useState({ president: 120, treasurer: 95 });
  const [totalVoters, setTotalVoters] = useState(200);
  const [votersParticipated, setVotersParticipated] = useState(150);

  const handlePositionChange = (e) => {
    const { name, value } = e.target;
    setNewPosition({ ...newPosition, [name]: value });
  };

  const handleAddPosition = () => {
    if (newPosition.title && newPosition.description) {
      setPositions([
        ...positions,
        {
          id: Date.now(),
          title: newPosition.title,
          description: newPosition.description,
        },
      ]);
      setNewPosition({ title: '', description: '' });
      setIsAddingPosition(false);
    } else {
      alert('Please fill in both the title and description!');
    }
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
      link = `yourapp.com/register?start=${startDateTime}&end=${endDateTime}`;
    } else if (linkType === 'nominate') {
      link = `yourapp.com/nominate?start=${startDateTime}&end=${endDateTime}`;
    } else if (linkType === 'vote') {
      link = `yourapp.com/vote?start=${startDateTime}&end=${endDateTime}`;
    }

    setGeneratedLink(link);
    setShowDateModal(false);
  };

  const refreshResults = () => {
    setVotes({
      president: Math.floor(Math.random() * 200),
      treasurer: Math.floor(Math.random() * 200),
    });
    setVotersParticipated(Math.floor(Math.random() * totalVoters));
  };

  const calculateParticipationPercentage = () => {
    return ((votersParticipated / totalVoters) * 100).toFixed(2);
  };

  return (
    <div className="container mx-auto p-6 lg:px-12 lg:max-w-screen-lg">
      <h1 className="text-3xl font-bold text-center mb-8">Election Committee Role</h1>

      {/* Manage Election Positions */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Manage Election Positions</h2>
        <div className="space-y-4">
          {positions.map((position, index) => (
            <div key={position.id} className="border p-4 rounded-md shadow-lg space-y-2">
              <input
                type="text"
                value={position.title}
                onChange={(e) => {
                  const updated = [...positions];
                  updated[index].title = e.target.value;
                  setPositions(updated);
                }}
                className="w-full p-2 border rounded-md font-semibold"
              />
              <textarea
                value={position.description}
                onChange={(e) => {
                  const updated = [...positions];
                  updated[index].description = e.target.value;
                  setPositions(updated);
                }}
                className="w-full p-2 border rounded-md"
                rows="3"
              />
              <button
                onClick={() => {
                  const filtered = positions.filter((_, i) => i !== index);
                  setPositions(filtered);
                }}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Remove
              </button>
            </div>
          ))}

          <button
            onClick={() => setIsAddingPosition(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Add New Position
          </button>

          {isAddingPosition && (
            <div className="mt-4 border p-4 rounded-md shadow-lg">
              <h3 className="font-semibold">New Position Details</h3>
              <div className="space-y-4">
                <input
                  type="text"
                  name="title"
                  placeholder="Enter position title"
                  value={newPosition.title}
                  onChange={handlePositionChange}
                  className="w-full p-2 border rounded-md"
                />
                <textarea
                  name="description"
                  placeholder="Enter position description"
                  value={newPosition.description}
                  onChange={handlePositionChange}
                  className="w-full p-2 border rounded-md"
                  rows="4"
                />
                <button
                  onClick={handleAddPosition}
                  className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                >
                  Save Position
                </button>
                <button
                  onClick={() => setIsAddingPosition(false)}
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 ml-2"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Link Generation */}
      <section className="space-y-6 mt-8">
        <h2 className="text-2xl font-semibold">Link Generation & Management</h2>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => {
                setShowDateModal(true);
                setLinkType('voter');
              }}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              Generate Voter Registration Link
            </button>
            <button
              onClick={() => {
                setShowDateModal(true);
                setLinkType('nominate');
              }}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              Generate Candidate Nomination Link
            </button>
            <button
              onClick={() => {
                setShowDateModal(true);
                setLinkType('vote');
              }}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              Generate Voting Link
            </button>
          </div>

          {/* Modal for Date/Time Inputs */}
          {showDateModal && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
              <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                <h3 className="text-xl font-semibold mb-4">Select Start and End Date/Time</h3>

                <div className="mb-4">
                  <label htmlFor="startDate" className="block text-lg">Start Date/Time</label>
                  <input
                    type="datetime-local"
                    id="startDate"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full p-2 border rounded-md"
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="endDate" className="block text-lg">End Date/Time</label>
                  <input
                    type="datetime-local"
                    id="endDate"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full p-2 border rounded-md"
                  />
                </div>

                <button
                  onClick={handleGenerateLink}
                  className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                >
                  Generate Link
                </button>
                <button
                  onClick={() => setShowDateModal(false)}
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 mt-2"
                >
                  Close
                </button>
              </div>
            </div>
          )}

          {generatedLink && (
            <div className="mt-6">
              <p className="font-semibold">Generated Link:</p>
              <a
                href={`https://${generatedLink}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline break-words"
              >
                {generatedLink}
              </a>
            </div>
          )}
        </div>
      </section>

      
    </div>
  );
}

export default ElectionCommitteeRole;
