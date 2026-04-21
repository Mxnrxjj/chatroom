import React from "react";
import { Edit, Search, Hash, Settings } from "lucide-react";
import { getCurrentUser } from "../../utils/auth";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Sidebar({
  activeRoom,
  setActiveRoom,
  isSidebarOpen,
  setIsSidebarOpen,
}) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const currentUser = user;
  const [showSettings, setShowSettings] = React.useState(false);

  return (
    <>
      {/* Background Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 backdrop-blur-[2px] z-40"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      <aside
        className={`fixed top-0 left-0 flex flex-col h-full w-72 bg-gray-200 border-r border-gray-300 z-50 transform transition-transform duration-300
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-300">
          <h1 className="text-lg font-bold">Messages</h1>
          <button className="p-2 hover:bg-gray-200 rounded-full">
            <Edit className="cursor-pointer hover:text-blue-500 hover:scale-105" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4">
          <div className="flex items-center bg-white rounded-full px-2 py-1 border border-gray-300 border-2 focus-within:border-blue-500 ">
            <Search className="text-gray-400 mr-2 cursor-pointer" />
            <input
              type="text"
              className="bg-transparent outline-none"
              placeholder="Search"
            />
          </div>
        </div>

        {/* Rooms */}
        <div className="p-3">
          <p className="text-xs text-gray-500 mb-2">ROOMS</p>
          {/* {rooms.map((room) => (
          <button>
            <Hash />
          </button>
        ))} */}
        </div>

        {/* Direct Messages */}
        <div className="px-3 mt-4">
          <p className="text-xs text-gray-500 mb-2">DIRECT MESSAGES</p>
        </div>

        {/* Footer */}
        <div className="mt-auto p-4 bg-white border-gray-300 border-t flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="font-semibold w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center">
              {currentUser?.username?.charAt(0)}
            </div>
            <div>
              <p className="text-sm font-semibold">{currentUser?.username}</p>
            </div>
          </div>
          <button
            className={`p-2 hover:bg-gray-200 rounded-full 
                      transition-transform duration-300 ${showSettings ? "rotate-[90deg]" : ""}`}
            onClick={() => setShowSettings((prev) => !prev)}
          >
            <Settings className="hover:cursor-pointer" />
          </button>
          {/* Dropdown Box */}
          {showSettings && (
            <div className="absolute right-0 bottom-12 w-40 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50">
              <button className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm">
                Profile
              </button>
              <button className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm">
                Settings
              </button>
              <button
                onClick={() => {
                  logout();
                  navigate("/login");
                }}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-red-500"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
