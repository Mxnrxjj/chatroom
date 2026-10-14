import { GitBranch, Coffee } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      id="about"
      className="border-t border-gray-200 dark:border-gray-800 py-10"
    >
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-xl font-bold">Pigeon</h3>

          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Secure real-time messaging built with the MERN stack.
          </p>
        </div>

        <div className="flex items-center gap-6">
          <a href="#features" className="hover:text-blue-600 transition">
            Features
          </a>

          <a href="#tech" className="hover:text-blue-600 transition">
            Tech Stack
          </a>

          <a
            href="https://github.com/mxnrxjj/chatroom"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 hover:text-blue-600 transition"
          >
            <GitBranch size={18} />
            GitHub
          </a>
        </div>
      </div>

      <div className="mt-8 text-center text-sm text-gray-500 flex items-center justify-center gap-2">
        <span>© {year} Pigeon.</span>
        <span>Made with</span>
        <Coffee size={16} className="text-amber-500" />
        <span>using React, Express, MongoDB & Socket.IO.</span>
      </div>
    </footer>
  );
}
