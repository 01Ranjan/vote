import React from 'react';
import img from '../assets/img.jpg';

function Navbar(props) {
  return (
    <div
      style={{ backgroundImage: `url(${img})` }}
      className="bg-cover bg-center h-20 flex items-center justify-between px-6  shadow-md"
    >
      <b className="text-xl">{props.title}</b>

      <ul className="flex space-x-6 font-medium">
        <li className="hover:text-orange-700 cursor-pointer">Voter</li>
        <li className="hover:text-blue-700 cursor-pointer">Candidate</li>
      </ul>
    </div>
  );
}

export default Navbar;

