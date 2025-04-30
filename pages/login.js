// pages/login.js
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useRouter } from "next/router";
import Image from "next/image";
import dogWallpaper from "../public/dog-wallpaper.png";
import googleIcon from "../public/google-icon.png";
import { getCurrentProfile } from "../lib/profile";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    // Update is_online to true
    const user = data?.user;
    if (user) {
      await supabase
        .from("profiles")
        .update({ is_online: true })
        .eq("id", user.id);
    }

    // Cek apakah profil lengkap
    const { profile } = await getCurrentProfile();

    if (!profile || !profile.full_name || !profile.address || !profile.phone) {
      router.push("/complete-profile");
    } else {
      alert("Login berhasil!");
      router.push("/");
    }

    setLoading(false);
  };

  return (
    <div className="relative h-screen w-screen flex justify-center items-center">
      {/* Background */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-80"
          style={{
            backgroundImage: `url(${dogWallpaper.src})`,
            backgroundPosition: "center top",
          }}
        />
        <div className="absolute inset-0 bg-black opacity-20"></div>
      </div>

      {/* Header */}
      <h1 className="absolute top-10 text-3xl md:text-4xl font-bold text-white text-center">
        Selamat Datang di <br />
        <span className="text-yellow-300">PawTrip PetShop</span> 🐾
      </h1>

      {/* Form Login */}
      <div className="relative z-10 bg-[#BDA697] bg-opacity-95 p-8 rounded-2xl shadow-lg w-[400px] text-center">
        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-20 h-10 px-16 py-6 bg-[#EBE3CC] rounded-full flex justify-center items-center">
          <h2 className="text-2xl font-bold text-black">Login</h2>
        </div>

        
        {error && <p className="text-red-500">{error}</p>}

        <form onSubmit={handleLogin} className="space-y-4 mt-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-3 w-full rounded-full focus:outline-none focus:ring-2 focus:ring-gray-400"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-3 w-full rounded-full focus:outline-none focus:ring-2 focus:ring-gray-400"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-black text-white p-3 w-full rounded-full mt-2 hover:bg-gray-800 transition"
          >
            {loading ? "Loading..." : "Login"}
          </button>
        </form>

        <div className="mt-4 text-sm text-gray-700">
          Belum memiliki akun?{" "}
          <span
            className="text-yellow-400 cursor-pointer"
            onClick={() => router.push("/register")}
          >
            Daftar
          </span>
        </div>

        <div
          className="flex items-center justify-center mt-4 border rounded-full p-3 cursor-pointer hover:bg-gray-100 transition"
          onClick={() => alert("Google Sign In coming soon!")}
        >
          <Image src={googleIcon} alt="Google" width={30} height={30} />
          <span className="ml-2 text-gray-800">Sign up with Google</span>
        </div>
      </div>

      {/* Icons */}
      <div className="absolute bottom-4 left-4 text-white text-2xl">🐾</div>
      <div className="absolute bottom-4 right-4 text-white text-2xl">🐾</div>
    </div>
  );
}
