import {
  Atom,
  Server,
  Database,
  Wind,
  GitBranch,
  ShieldCheck,
} from "lucide-react";

const tech = [
  {
    icon: Atom,
    name: "React",
    color: "text-cyan-500",
  },
  {
    icon: Server,
    name: "Express.js",
    color: "text-gray-700 dark:text-gray-300",
  },
  {
    icon: Database,
    name: "MongoDB",
    color: "text-green-600",
  },
  {
    icon: Wind,
    name: "Tailwind CSS",
    color: "text-sky-500",
  },
  {
    icon: GitBranch,
    name: "Socket.IO",
    color: "text-purple-500",
  },
  {
    icon: ShieldCheck,
    name: "JWT Auth",
    color: "text-blue-600",
  },
];

export default function TechStack() {
  return (
    <section id="tech" className="py-28">
      <div className="text-center max-w-3xl mx-auto">
        <h2 className="text-4xl font-bold">Built With Modern Technologies</h2>

        <p className="mt-5 text-gray-600 dark:text-gray-300">
          Pigeon is powered by a modern MERN stack with secure authentication
          and real-time communication.
        </p>
      </div>

      <div className="mt-16 flex flex-wrap justify-center gap-6">
        {tech.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.name}
              className="w-44 rounded-3xl border border-gray-200 dark:border-gray-700 p-8 text-center hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
            >
              <Icon className={`mx-auto mb-5 ${item.color}`} size={42} />

              <h3 className="font-semibold">{item.name}</h3>
            </div>
          );
        })}
      </div>
    </section>
  );
}
