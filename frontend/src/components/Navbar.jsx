import React, { useState } from 'react';
import img from '../assets/img.jpg';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react'; // optional: for nicer icons, or use plain text

function Navbar(props) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div
      style={{ backgroundImage: `url(${img})` }}
      className="bg-cover bg-center h-20 flex items-center justify-between px-6 shadow-md relative"
    >
      <b className="text-2xl text-black">{props.title}</b>
      
      {/* Hamburger Icon (Mobile) */}
      <div className="">
        <button onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={28} className="text-black hover:text-red-600" /> : <Menu size={28} className="text-black hover:text-orange-6002" />}
        </button>
      </div>

      {/* Dropdown Menu */}
      {menuOpen && (
        <div className="absolute top-20 right-6 bg-white shadow-md rounded-md p-4 space-y-2 w-70 z-50">
          <Link to="/admin-login" onClick={() => setMenuOpen(false)}>
            <div className="hover:bg-gray-100 px-3 py-2 rounded cursor-pointer">
            <Link to="/login"><div className="hover:text-orange-600 cursor-pointer">Login</div>
            </Link>
            </div>
          </Link>
          <Link to="/voter-login" onClick={() => setMenuOpen(false)}>
            <div className="hover:bg-gray-100 px-3 py-2 rounded cursor-pointer">
              <Link to="/Candidate"><div className="hover:text-orange-600 cursor-pointer">Candidate Registration</div>
              </Link></div>
          </Link>
          <Link to="/voter-login" onClick={() => setMenuOpen(false)}>
            <div className="hover:bg-gray-100 px-3 py-2 rounded cursor-pointer">
            <Link to="/voter"><div className="hover:text-orange-600 cursor-pointer">Voter Registration</div></Link>
            </div>
          </Link>
        </div>
      )}
    </div>
  );
}

export default Navbar;
