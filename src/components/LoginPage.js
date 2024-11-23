import { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

const LoginPage = ({ onLogin, serverData, isAdmin, credentials }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    const fetchPromise = axios.post(
      "http://31.56.39.143:3000/login",
      {
        username,
        password,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    toast.promise(fetchPromise, {
      pending: "Syncing data with database...",
      success: "Login succesful!",
      error: "Invalid credentials!",
    });

    try {
      const response = await fetchPromise;
      if (response.data.success) {
        serverData(response.data.serverList);
        credentials(response.data.credential);
        isAdmin(response.data.isAdmin);
        onLogin();
      }
    } catch (error) {
      console.error("Error during login:", error.message);
    }
  };

  useEffect(() => {
    document.title = "Login";
  }, []);

  return (
    <section className="bg-mainBg">
      <div className="flex flex-col items-center justify-center min-h-screen px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-[#1F2937] rounded shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xs font-bold text-gray-400 uppercase">
              login to dashboard
            </h1>
            <form className="space-y-4 md:space-y-6" onSubmit={handleLogin}>
              <div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-[#111827] text-white rounded block w-full p-2.5"
                  placeholder="username"
                  required
                />
              </div>
              <div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="bg-[#111827] text-white rounded block w-full p-2.5"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full text-white bg-violet-600 hover:bg-violet-800 font-medium rounded text-sm px-5 py-2.5 text-center"
              >
                Sign in
              </button>
            </form>
            <ToastContainer
              position="bottom-center"
              autoClose={2000}
              theme="light"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoginPage;
