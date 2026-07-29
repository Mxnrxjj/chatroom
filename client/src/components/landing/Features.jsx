import {
  MessageCircle,
  ShieldCheck,
  UserCircle,
  CircleDot,
  Keyboard,
  Moon,
} from "lucide-react";

const features = [
  {
    icon: MessageCircle,
    title: "Real-Time Messaging",
    description:
      "Messages are delivered instantly using Socket.IO for seamless conversations.",
  },
  {
    icon: ShieldCheck,
    title: "PIN Protected Chats",
    description:
      "Secure your private conversations with chat security and PIN protection.",
  },
  {
    icon: UserCircle,
    title: "Custom Profiles",
    description: "Personalize your account with an avatar, username and bio.",
  },
  {
    icon: CircleDot,
    title: "Live Presence",
    description: "Know who's online and see when friends were last active.",
  },
  {
    icon: Keyboard,
    title: "Typing Indicators",
    description: "See when someone is replying before the message arrives.",
  },
  {
    icon: Moon,
    title: "Dark Mode",
    description:
      "A beautiful interface that adapts perfectly to light and dark themes.",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-28">
      <div className="text-center max-w-3xl mx-auto">
        <h2 className="text-4xl font-bold">Why Choose Pigeon?</h2>

        <p className="mt-5 text-gray-600 dark:text-gray-300">
          Everything you need for a modern real-time messaging experience.
        </p>
      </div>

      <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature) => {
          const Icon = feature.icon;

          return (
            <div
              key={feature.title}
              className="rounded-3xl border border-gray-200 dark:border-gray-700 p-8 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center mb-6">
                <Icon size={28} />
              </div>

              <h3 className="text-xl font-semibold">{feature.title}</h3>

              <p className="mt-4 text-gray-600 dark:text-gray-300 leading-7">
                {feature.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
