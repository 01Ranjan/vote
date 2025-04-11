import React, { useState, useRef, useEffect } from 'react';
import {
  Chart as ChartJS,
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import ReactFlow, { Background } from 'reactflow';
import 'reactflow/dist/style.css';
import ResizeObserver from 'resize-observer-polyfill';

ChartJS.register(BarElement, ArcElement, CategoryScale, LinearScale, Tooltip, Legend);

const positions = ['President', 'Vice President', 'Secretary', 'Treasurer'];

function distributeVotesEvenly(position, totalVotes) {
  const numCandidates = 8;
  const baseVotes = Math.floor(totalVotes / numCandidates);
  let remainingVotes = totalVotes - baseVotes * numCandidates;

  return Array.from({ length: numCandidates }, (_, i) => {
    const bonus = remainingVotes > 0 ? 1 : 0;
    remainingVotes -= bonus;
    return {
      name: `${position} Candidate ${i + 1}`,
      votes: baseVotes + bonus,
    };
  });
}

function generateVoteData(votersParticipated) {
  const totalPositions = positions.length;
  const perPositionVotes = Math.floor(votersParticipated / totalPositions);

  return Object.fromEntries(
    positions.map((position) => [
      position,
      distributeVotesEvenly(position, perPositionVotes),
    ])
  );
}

function ResultsMonitoring() {
  const [totalVoters] = useState(300);
  const [votersParticipated, setVotersParticipated] = useState(200);
  const [votes, setVotes] = useState(() => generateVoteData(200));

  const refreshResults = () => {
    const newParticipants = Math.floor(Math.random() * (totalVoters + 1));
    setVotersParticipated(newParticipants);
    setVotes(generateVoteData(newParticipants));
  };

  const participationPercentage = ((votersParticipated / totalVoters) * 100).toFixed(2);

  const pieData = {
    labels: ['Participated', 'Not Participated'],
    datasets: [
      {
        data: [votersParticipated, totalVoters - votersParticipated],
        backgroundColor: ['#34d399', '#f87171'],
      },
    ],
  };

  const nodes = [
    { id: '1', data: { label: 'Voter Registration' }, position: { x: 0, y: 0 }, style: baseStyle('#3b82f6') },
    { id: '2', data: { label: 'Candidate Nomination' }, position: { x: 250, y: 0 }, style: baseStyle('#10b981') },
    { id: '3', data: { label: 'Voting Phase' }, position: { x: 500, y: 0 }, style: baseStyle('#f59e0b') },
    { id: '4', data: { label: 'Results Declaration' }, position: { x: 750, y: 0 }, style: baseStyle('#ef4444') },
  ];

  const edges = [
    { id: 'e1-2', source: '1', target: '2', animated: true },
    { id: 'e2-3', source: '2', target: '3', animated: true },
    { id: 'e3-4', source: '3', target: '4', animated: true },
  ];

  const flowWrapper = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 200 });

  useEffect(() => {
    if (!flowWrapper.current) return;
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setDimensions({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
    });
    resizeObserver.observe(flowWrapper.current);
    return () => resizeObserver.disconnect();
  }, []);

  const handlePrint = (position) => {
    const content = document.getElementById(`print-${position}`);
    const newWin = window.open('', '', 'width=900,height=650');
    newWin.document.write('<html><head><title>Vote Report</title>');
    newWin.document.write('<style>table{width:100%;border-collapse:collapse}td,th{padding:8px;border:1px solid #ccc;text-align:left}</style>');
    newWin.document.write('</head><body >');
    newWin.document.write(content.innerHTML);
    newWin.document.write('</body></html>');
    newWin.document.close();
    newWin.print();
  };

  return (
    <div className="container mx-auto p-6 lg:px-12 lg:max-w-screen-xl space-y-8">
      <h1 className="text-3xl font-bold text-center mb-4">Results Monitoring</h1>

      {/* Election Flow */}
      <div className="bg-white p-4 rounded-lg shadow-xl">
        <h2 className="text-xl font-bold mb-4">Election Process Flow</h2>
        <div ref={flowWrapper} className="w-full h-[150px] sm:h-[175px] md:h-[200px] rounded overflow-hidden">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            fitView
            panOnDrag={false}
            zoomOnScroll
            zoomOnPinch
            zoomOnDoubleClick={false}
            nodesDraggable={false}
            nodesConnectable={false}
            elementsSelectable={false}
            minZoom={0.25}
            maxZoom={1.25}
            style={{ width: dimensions.width, height: dimensions.height, background: '#f9fafb' }}
          >
            <Background gap={16} color="#e5e7eb" />
          </ReactFlow>
        </div>
      </div>

      {/* Vote Distribution + Tables */}
      {positions.map((position, idx) => {
        const positionVotes = votes[position];
        const totalVotes = positionVotes.reduce((sum, c) => sum + c.votes, 0);

        return (
          <div key={idx} className="bg-white p-4 rounded-lg shadow-xl space-y-6">
            <h2 className="text-xl font-semibold mb-2">{position} Vote Distribution</h2>
            <div style={{ height: '300px' }}>
              <Bar
                data={{
                  labels: positionVotes.map((c) => c.name),
                  datasets: [
                    {
                      label: 'Votes',
                      data: positionVotes.map((c) => c.votes),
                      backgroundColor: '#3b82f6',
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                    },
                  },
                }}
              />
            </div>

            {/* Table */}
            <div id={`print-${position}`} className="overflow-x-auto">
              <h3 className="text-lg font-medium mt-4 mb-2">{position} Detailed Vote Table</h3>
              <table className="min-w-full table-auto border">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 border">Candidate</th>
                    <th className="px-4 py-2 border">Votes</th>
                  </tr>
                </thead>
                <tbody>
                  {positionVotes.map((candidate, index) => (
                    <tr key={`${position}-${index}`} className="border-t">
                      <td className="px-4 py-2 border">{candidate.name}</td>
                      <td className="px-4 py-2 border">{candidate.votes}</td>
                    </tr>
                  ))}
                  <tr className="font-semibold bg-gray-50">
                    <td className="px-4 py-2 border">Total</td>
                    <td className="px-4 py-2 border">{totalVotes}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="text-right">
              <button
                onClick={() => handlePrint(position)}
                className="mt-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Print {position} Report
              </button>
            </div>
          </div>
        );
      })}

      {/* Voter Participation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-4 rounded-lg shadow-xl">
          <h2 className="text-xl font-semibold mb-4">Voter Participation</h2>
          <Pie data={pieData} />
          <p className="text-center mt-4 font-medium">Participation Rate: {participationPercentage}%</p>
        </div>

        {/* Summary Info */}
        <div className="bg-white shadow-xl rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">Participation Stats</h2>
          <div className="space-y-2 text-sm text-gray-700">
            <p>Total Voters: {totalVoters}</p>
            <p>Voters Participated: {votersParticipated}</p>
            <p>Participation Rate: {participationPercentage}%</p>
          </div>
        </div>
      </div>

      {/* Refresh Button */}
      <div className="text-center">
        <button
          onClick={refreshResults}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Refresh Results
        </button>
      </div>
    </div>
  );
}

const baseStyle = (color) => ({
  background: color,
  color: 'white',
  padding: 10,
  borderRadius: 8,
  boxShadow: `0 8px 20px ${color}55`,
});

export default ResultsMonitoring;
