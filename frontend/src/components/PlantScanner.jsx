import React, { useState } from "react";
import axios from "axios";

export default function PlantScanner() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  // Make the AI result beautiful
  const formatText = (text) => {
    let formatted = text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\n\* /g, "<br/>• ")
      .replace(/\n\n/g, "<br/><br/>")
      .replace(/\n/g, "<br/>");

    return formatted;
  };

  const handleScan = async () => {
    if (!image) return;
    setLoading(true);

    const formData = new FormData();
    formData.append("file", image);

    try {
      const res = await axios.post("https://plant-management-app-0jp3.onrender.com/plant/scan", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Backend already parses the Groq response and returns plain text in "answer"
      const text = res.data.answer || "Unable to identify plant.";
      setResult(formatText(text));
    } catch (err) {
      console.error("Plant scan error:", err);
      setResult("❌ Error scanning image.");
    }

    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-green-100 to-green-300 px-4">

      {/* Center Glass Card */}
      <div className="w-full max-w-lg bg-white/70 backdrop-blur-xl shadow-2xl rounded-3xl p-8 border border-white/40 mt-[-40px]">

        <h2 className="text-3xl font-extrabold text-green-800 mb-6 text-center">
          🌿 AI Plant Scanner
        </h2>

        {/* Upload Field */}
        <label className="block mb-6">
          <span className="text-gray-800 font-semibold text-lg">Upload a plant image</span>

          <input
            type="file"
            accept="image/*"
            onChange={handleFile}
            className="mt-3 block w-full text-sm text-gray-700 
            file:mr-4 file:py-3 file:px-5
            file:rounded-xl file:border-0
            file:text-sm file:font-semibold
            file:bg-green-600 file:text-white
            hover:file:bg-green-700 cursor-pointer shadow-md"
          />
        </label>

        {/* Image Preview */}
        {preview && (
          <div className="mb-6 flex justify-center">
            <img
              src={preview}
              alt="Preview"
              className="rounded-2xl shadow-lg border w-full max-h-72 object-cover transition hover:scale-[1.02]"
            />
          </div>
        )}

        {/* Scan Button */}
        <button
          className={`w-full py-3 rounded-2xl text-white font-bold text-lg shadow-lg transition-all 
          ${loading ? "bg-green-400 cursor-not-allowed" : "bg-green-700 hover:bg-green-800"}
          `}
          onClick={handleScan}
          disabled={loading}
        >
          {loading ? "🔍 Scanning..." : "🌱 Scan Plant"}
        </button>

        {/* Result Box */}
        {result && (
          <div className="mt-6 bg-white/80 backdrop-blur-lg border border-green-300 rounded-2xl p-5 shadow-inner max-h-72 overflow-y-auto text-[15px]">

            <h3 className="font-bold text-green-800 text-xl mb-3">
              📝 Scan Result
            </h3>

            <div
              className="text-gray-900 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: result }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
