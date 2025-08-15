import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const steps = [
  "Original Image",
  "Secret Message",
  "Text to Binary",
  "Pixel Analysis", 
  "Binary Breakdown",
  "LSB Extraction",
  "LSB Modification",
  "Pixel Reconstruction",
  "Final Image",
  "Export Complete"
];

// Sample secret message
const secretMessage = "HELLO";
const messageBinary = "0100100001000101010011000100110001001111"; // "HELLO" in binary

// Sample pixel data (RGB values)
const samplePixels = [
  { r: 202, g: 173, b: 233 }, // Purple-ish
  { r: 154, g: 205, b: 50 },  // Yellow-green
  { r: 255, g: 99, b: 71 },   // Tomato
  { r: 70, g: 130, b: 180 },  // Steel blue
  { r: 255, g: 215, b: 0 },   // Gold
];

const sImage = '/playground/images/WhatsApp Image 2025-08-10 at 22.13.04_206d41a9.jpg';

export default function LSBEncoderAnimation() {
  const [step, setStep] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [currentBit, setCurrentBit] = useState(0);
  const [encodedPixels, setEncodedPixels] = useState([]);

  // Pixel zoom effect for step 3
  useEffect(() => {
    if (step === 3) {
      setZoomLevel(1);
      const interval = setInterval(() => {
        setZoomLevel((z) => {
          if (z < 4) return z + 0.1;
          clearInterval(interval);
          return z;
        });
      }, 100);
      return () => clearInterval(interval);
    }
  }, [step]);

  // Binary highlighting animation for LSB modification
  useEffect(() => {
    if (step === 6) {
      const interval = setInterval(() => {
        setCurrentBit((prev) => (prev + 1) % messageBinary.length);
      }, 800);
      return () => clearInterval(interval);
    }
  }, [step]);

  // Generate encoded pixels when reaching LSB modification step
  useEffect(() => {
    if (step === 6 && encodedPixels.length === 0) {
      const encoded = samplePixels.map((pixel, index) => {
        if (index < messageBinary.length) {
          const bit = messageBinary[index];
          return {
            ...pixel,
            b: (pixel.b & 0xFE) | parseInt(bit) // Modify LSB
          };
        }
        return pixel;
      });
      setEncodedPixels(encoded);
    }
  }, [step, encodedPixels]);

  const nextStep = () => setStep((prev) => Math.min(prev + 1, steps.length - 1));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 0));

  const toBinary = (num) => num.toString(2).padStart(8, '0');

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white p-4">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          LSB Steganography
        </h1>
        <h2 className="text-2xl mb-2">{steps[step]}</h2>
        <div className="flex justify-center space-x-2 mb-4">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full ${
                index <= step ? 'bg-blue-500' : 'bg-gray-600'
              } transition-colors duration-300`}
            />
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="relative w-full max-w-4xl h-96 bg-gray-800 rounded-xl overflow-hidden flex items-center justify-center border border-gray-700 shadow-2xl">
        <AnimatePresence mode="wait">
          {/* Step 0: Original Image */}
          {step === 0 && (
            <motion.div
              key="original"
              className="text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              transition={{ duration: 0.6 }}
            >
              <img
                src={sImage}
                alt="Original"
                className="w-64 h-64 object-cover rounded-lg shadow-lg mb-4"
              />
              <p className="text-lg">This is our cover image</p>
              <p className="text-sm text-gray-400">Appears completely normal to the naked eye</p>
            </motion.div>
          )}

          {/* Step 1: Secret Message */}
          {step === 1 && (
            <motion.div
              key="secret"
              className="text-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.6 }}
            >
              <motion.div 
                className="bg-red-500 text-white px-8 py-4 rounded-lg text-3xl font-bold mb-4 shadow-lg"
                animate={{ 
                  boxShadow: ["0 0 0 0 rgba(239, 68, 68, 0.4)", "0 0 0 20px rgba(239, 68, 68, 0)", "0 0 0 0 rgba(239, 68, 68, 0.4)"]
                }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                {secretMessage}
              </motion.div>
              <p className="text-lg">Secret message to hide</p>
              <p className="text-sm text-gray-400">This will be embedded invisibly in the image</p>
            </motion.div>
          )}

          {/* Step 2: Text to Binary */}
          {step === 2 && (
            <motion.div
              key="binary-convert"
              className="text-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.6 }}
            >
              <div className="mb-6">
                <div className="text-2xl font-bold mb-2">{secretMessage}</div>
                <motion.div 
                  className="text-6xl"
                  initial={{ scale: 1 }}
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  ↓
                </motion.div>
              </div>
              <div className="font-mono text-lg bg-gray-700 p-4 rounded-lg">
                <div className="grid grid-cols-5 gap-4">
                  {secretMessage.split('').map((char, i) => (
                    <div key={i} className="text-center">
                      <div className="text-xl font-bold text-blue-400">{char}</div>
                      <div className="text-sm text-green-400">{char.charCodeAt(0).toString(2).padStart(8, '0')}</div>
                    </div>
                  ))}
                </div>
              </div>
              <p className="text-sm text-gray-400 mt-4">Each character converted to 8-bit binary</p>
            </motion.div>
          )}

          {/* Step 3: Pixel Analysis */}
          {step === 3 && (
            <motion.div
              key="pixel-analysis"
              className="relative w-full h-full overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
            >
              <motion.img
                src={sImage}
                alt="Zoom"
                className="w-full h-full object-cover"
                style={{
                  transform: `scale(${zoomLevel})`,
                  transformOrigin: "center",
                  imageRendering: "pixelated",
                }}
              />
              {/* Pixel grid overlay */}
              <div className="absolute inset-0 grid grid-cols-8 grid-rows-8 border border-yellow-500">
                {Array.from({ length: 64 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="border border-yellow-400 bg-yellow-500 bg-opacity-20"
                    animate={{
                      backgroundColor: i < 5 ? ["rgba(239, 68, 68, 0.3)", "rgba(239, 68, 68, 0.6)", "rgba(239, 68, 68, 0.3)"] : "transparent"
                    }}
                    transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.1 }}
                  />
                ))}
              </div>
              <div className="absolute bottom-4 left-4 bg-black bg-opacity-75 p-3 rounded-lg">
                <p className="text-sm">Zooming into individual pixels</p>
                <p className="text-xs text-gray-400">First 5 pixels will store our message</p>
              </div>
            </motion.div>
          )}

          {/* Step 4: Binary Breakdown */}
          {step === 4 && (
            <motion.div
              key="binary-breakdown"
              className="flex flex-col items-center w-full px-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="text-xl mb-4">Pixel RGB Values</h3>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 w-full max-w-6xl">
                {samplePixels.slice(0, 5).map((pixel, i) => (
                  <motion.div 
                    key={i}
                    className="bg-gray-700 p-3 rounded-lg text-center"
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <div 
                      className="w-12 h-12 rounded mx-auto mb-2" 
                      style={{ backgroundColor: `rgb(${pixel.r}, ${pixel.g}, ${pixel.b})` }}
                    />
                    <div className="text-xs font-mono space-y-1">
                      <div className="text-red-400">R: {pixel.r} ({toBinary(pixel.r)})</div>
                      <div className="text-green-400">G: {pixel.g} ({toBinary(pixel.g)})</div>
                      <div className="text-blue-400">B: {pixel.b} ({toBinary(pixel.b)})</div>
                    </div>
                  </motion.div>
                ))}
              </div>
              <p className="text-sm text-gray-400 mt-4">Each color channel is 8 bits (0-255)</p>
            </motion.div>
          )}

          {/* Step 5: LSB Extraction */}
          {step === 5 && (
            <motion.div
              key="lsb-extraction"
              className="flex flex-col items-center w-full px-4"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="text-xl mb-4">Extracting Least Significant Bits (Blue Channel)</h3>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 w-full max-w-6xl">
                {samplePixels.slice(0, 5).map((pixel, i) => (
                  <div key={i} className="bg-gray-700 p-3 rounded-lg text-center">
                    <div 
                      className="w-12 h-12 rounded mx-auto mb-2" 
                      style={{ backgroundColor: `rgb(${pixel.r}, ${pixel.g}, ${pixel.b})` }}
                    />
                    <div className="font-mono text-sm">
                      <div className="text-blue-400 mb-2">Blue: {pixel.b}</div>
                      <div className="text-blue-400">
                        {toBinary(pixel.b).substring(0, 7)}
                        <motion.span 
                          className="bg-yellow-400 text-black px-1 rounded"
                          animate={{ backgroundColor: ["#FACC15", "#EF4444", "#FACC15"] }}
                          transition={{ repeat: Infinity, duration: 1 }}
                        >
                          {toBinary(pixel.b).substring(7)}
                        </motion.span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-400 mt-4">The rightmost bit (LSB) will be replaced</p>
            </motion.div>
          )}

          {/* Step 6: LSB Modification */}
          {step === 6 && (
            <motion.div
              key="lsb-modification"
              className="flex flex-col items-center w-full px-4"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="text-xl mb-2">Replacing LSBs with Message Bits</h3>
              <div className="bg-gray-700 p-3 rounded-lg mb-4 font-mono">
                Message Binary: {messageBinary.split('').map((bit, i) => (
                  <span 
                    key={i}
                    className={`${i === currentBit ? 'bg-yellow-400 text-black' : ''} px-1`}
                  >
                    {bit}
                  </span>
                ))}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 w-full max-w-6xl">
                {samplePixels.slice(0, 5).map((pixel, i) => {
                  const newBlue = encodedPixels[i]?.b || pixel.b;
                  const messageBit = messageBinary[i] || '0';
                  return (
                    <div key={i} className="bg-gray-700 p-3 rounded-lg text-center">
                      <div 
                        className="w-12 h-12 rounded mx-auto mb-2" 
                        style={{ backgroundColor: `rgb(${pixel.r}, ${pixel.g}, ${newBlue})` }}
                      />
                      <div className="font-mono text-xs space-y-1">
                        <div className="text-blue-400">
                          {toBinary(pixel.b).substring(0, 7)}
                          <span className="bg-red-400 text-black px-1 rounded">
                            {toBinary(pixel.b).substring(7)}
                          </span>
                        </div>
                        <div>↓</div>
                        <div className="text-blue-400">
                          {toBinary(newBlue).substring(0, 7)}
                          <span className="bg-green-400 text-black px-1 rounded">
                            {messageBit}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <p className="text-sm text-gray-400 mt-4">LSBs now contain our secret message bits!</p>
            </motion.div>
          )}

          {/* Step 7: Pixel Reconstruction */}
          {step === 7 && (
            <motion.div
              key="reconstruction"
              className="text-center"
              initial={{ opacity: 0, scale: 1.2 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex justify-center space-x-8 mb-4">
                <div className="text-center">
                  <img
                    src={sImage}
                    alt="Original"
                    className="w-48 h-48 object-cover rounded-lg shadow-lg mb-2"
                  />
                  <p className="text-sm">Original</p>
                </div>
                <div className="text-center">
                  <img
                    src={sImage}
                    alt="Modified"
                    className="w-48 h-48 object-cover rounded-lg shadow-lg mb-2"
                  />
                  <p className="text-sm">With Hidden Message</p>
                </div>
              </div>
              <motion.div 
                className="text-6xl"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                👁️
              </motion.div>
              <p className="text-lg mt-2">Images look identical!</p>
              <p className="text-sm text-gray-400">Changes in LSBs are imperceptible to human eye</p>
            </motion.div>
          )}

          {/* Step 8: Final Image */}
          {step === 8 && (
            <motion.img
              key="final"
              src={sImage}
              alt="Final"
              className="w-64 h-64 object-cover rounded-lg shadow-lg"
              initial={{ opacity: 0, scale: 1.2 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.6 }}
            />
          )}

          {/* Step 9: Export */}
          {step === 9 && (
            <motion.div
              key="export"
              className="flex flex-col items-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.6 }}
            >
              <img
                src={sImage}
                alt="Export"
                className="w-48 h-48 object-cover mb-4 rounded-lg shadow-lg"
              />
              <motion.div
                className="w-16 h-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-lg flex items-center justify-center text-2xl shadow-lg"
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                ✓
              </motion.div>
              <p className="mt-4 text-lg font-semibold">Steganography Complete!</p>
              <p className="text-sm text-gray-400">Message "{secretMessage}" is now hidden in the image</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="flex space-x-4 mt-6">
        <button
          onClick={prevStep}
          disabled={step === 0}
          className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 px-6 py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold shadow-lg"
        >
          ← Previous
        </button>
        <div className="flex items-center px-4 py-2 bg-gray-800 rounded-lg">
          <span className="text-sm">{step + 1} / {steps.length}</span>
        </div>
        <button
          onClick={nextStep}
          disabled={step === steps.length - 1}
          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-400 hover:to-purple-500 px-6 py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold shadow-lg"
        >
          Next →
        </button>
      </div>

      {/* Additional Info Panel */}
      <div className="mt-6 max-w-2xl text-center">
        <div className="bg-gray-800 bg-opacity-50 p-4 rounded-lg border border-gray-700">
          {step === 0 && <p className="text-sm text-gray-300">We start with a normal image that will serve as our cover.</p>}
          {step === 1 && <p className="text-sm text-gray-300">This is the secret message we want to hide inside the image.</p>}
          {step === 2 && <p className="text-sm text-gray-300">Converting text to binary is the first step in digital steganography.</p>}
          {step === 3 && <p className="text-sm text-gray-300">We examine individual pixels where our message will be stored.</p>}
          {step === 4 && <p className="text-sm text-gray-300">Each pixel has RGB values, each represented as 8-bit numbers.</p>}
          {step === 5 && <p className="text-sm text-gray-300">The LSB is the rightmost bit - changing it has minimal visual impact.</p>}
          {step === 6 && <p className="text-sm text-gray-300">We replace LSBs with our message bits one by one.</p>}
          {step === 7 && <p className="text-sm text-gray-300">The modified image looks identical to the original image.</p>}
          {step === 8 && <p className="text-sm text-gray-300">Our final image contains the hidden message!</p>}
          {step === 9 && <p className="text-sm text-gray-300">The steganographic process is complete and ready for transmission.</p>}
        </div>
      </div>
    </div>
  );
}