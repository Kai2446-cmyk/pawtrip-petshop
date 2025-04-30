import { useEffect, useState } from "react";
import { getPets } from "../lib/supabaseAPI";
import { supabase } from "../lib/supabase";
import Header from "../components/Header";
import Footer from "../components/Footer";
import PawTrip from "../components/Pawtrip";

export default function Pets() {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getPets();
        setPets(data);
      } catch (err) {
        setError("Gagal memuat data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAdopt = async (pet) => {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      alert("Silakan login terlebih dahulu.");
      return;
    }

    const { error } = await supabase.from("adoptions").insert([{
      user_id: user.id,
      pet_id: pet.id,
      status: "pending",
    }]);

    if (!error) {
      alert(`Berhasil mengajukan adopsi untuk ${pet.name}!`);
      setPets((prev) =>
        prev.map((p) => (p.id === pet.id ? { ...p, available: false } : p))
      );
    } else {
      console.error(error);
      alert("Gagal mengadopsi.");
    }
  };

  return (
    <>
      <Header />
      <PawTrip />
      <div
        className="p-8 min-h-screen bg-cover bg-center flex flex-col items-center"
        style={{ background: "White" }}
      >
        <div className="container mx-auto p-6 max-w-7xl w-full bg-white/80 rounded-xl">

          {/* Judul Halaman */}
          <div className="flex flex-col mb-8">
            <h1 className="text-4xl font-extrabold text-center text-[#4E3628] mb-1 animate-bounce">
              🐾 Temukan Sahabat Barumu! 🐾
            </h1>
            <div className="w-full h-1 bg-[#4E3628] mt-2" />
          </div>

          

          {/* Loading dan Error */}
          {loading && <div className="text-lg text-[#5D4037]">Memuat data pet...</div>}
          {error && <div className="text-lg text-red-600">{error}</div>}

          {/* Daftar Pets */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-8 w-full">
            {pets.map((pet) => (
              <div
                key={pet.id}
                className={`relative bg-white border border-[#4E3628] rounded-3xl shadow-xl overflow-hidden transform hover:scale-105 transition duration-300 ${
                  !pet.available && "opacity-50 pointer-events-none"
                }`}
              >
                {!pet.available && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white font-bold text-xl z-10">
                    Telah Diadopsi
                  </div>
                )}

                <div className="relative h-56">
                  <img
                    src={pet.image_url}
                    alt={pet.name}
                    className={`w-full h-full object-cover rounded-t-3xl ${!pet.available && "blur-sm"}`}
                  />
                  <div className="absolute top-2 left-2 bg-[#A1887F] text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                    {pet.category === "dog" ? "🐶 Anjing" : "🐱 Kucing"}
                  </div>
                </div>

                <div className="p-6 text-center">
                  <h2 className="text-2xl font-semibold text-[#5D4037]">
                    {pet.name}
                  </h2>
                  <p className="text-gray-600 text-lg font-medium mt-2">
                    🐾 {pet.breed}
                  </p>
                  <p className="text-gray-500 text-sm mt-1">
                    📅 {pet.age} tahun
                  </p>

                  <button
                    onClick={() => handleAdopt(pet)}
                    disabled={!pet.available}
                    className={`mt-4 w-full text-lg px-5 py-3 rounded-xl transition font-semibold shadow-md ${
                      pet.available
                        ? "bg-[#A1887F] text-white hover:bg-[#8D6E63]"
                        : "bg-gray-400 text-white cursor-not-allowed"
                    }`}
                  >
                    ❤️ {pet.available ? `Adopsi ${pet.name} Sekarang!` : "Tidak Tersedia"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
