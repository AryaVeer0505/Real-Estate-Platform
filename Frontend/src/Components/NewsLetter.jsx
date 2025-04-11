import { useState } from "react";
import { FiMail } from "react-icons/fi";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      alert("Please enter a valid email address.");
      return;
    }

    console.log("Subscribed:", email);
    setSuccess(true);
    setEmail("");

    setTimeout(() => setSuccess(false), 4000);
  };

  return (
    <section className="bg-gray-100 py-12 px-4 mt-16">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8 text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-blue-100 p-4 rounded-full">
            <FiMail className="text-green-600 text-3xl" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          Stay in the Loop
        </h2>
        <p className="text-gray-500 mb-6">
          Get property updates, market trends & exclusive listings in your inbox.
        </p>

        <form
          onSubmit={handleSubscribe}
          className="flex flex-col sm:flex-row items-center gap-4 justify-center"
        >
          <input
            type="email"
            placeholder="Enter your email"
            className="px-4 py-2 rounded-md border border-gray-300 w-full sm:w-2/3 focus:outline-none focus:ring-2 focus:ring-green-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            type="submit"
            className="bg-green-600 text-white font-semibold px-6 py-2 rounded-md hover:bg-green-700 transition"
          >
            Subscribe
          </button>
        </form>

        {success && (
          <p className="mt-4 text-green-600 font-medium">
            You're subscribed! 🏡
          </p>
        )}
      </div>
    </section>
  );
};

export default Newsletter;
