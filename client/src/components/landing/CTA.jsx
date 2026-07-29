import { Link } from "react-router-dom";

export default function CTA() {
  return (
    <section className="py-28">
      <div className="max-w-5xl mx-auto rounded-3xl bg-blue-600 text-white px-8 py-20 text-center">
        <h2 className="text-4xl md:text-5xl font-bold">
          Ready to Start Chatting?
        </h2>

        <p className="mt-6 text-lg text-blue-100 max-w-2xl mx-auto leading-8">
          Experience secure, real-time conversations with modern messaging, live
          presence, typing indicators, customizable profiles, and PIN-protected
          chats.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link
            to="/login"
            className="bg-white text-blue-600 px-8 py-3 rounded-xl font-semibold hover:scale-105 transition"
          >
            Get Started
          </Link>

          <a
            href="https://github.com/mxnrxjj/chatroom"
            target="_blank"
            rel="noreferrer"
            className="border border-white px-8 py-3 rounded-xl hover:bg-white/10 transition"
          >
            View Source
          </a>
        </div>
      </div>
    </section>
  );
}
