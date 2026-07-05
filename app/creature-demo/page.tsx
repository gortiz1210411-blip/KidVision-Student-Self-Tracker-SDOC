"use client";

import { useState } from "react";

// Creature component with customizable features
function Creature({ 
  stage = "baby",
  bodyColor = "#8b5cf6",
  eyeStyle = "normal",
  accessory = "none",
  mood = "happy"
}: {
  stage?: "egg" | "baby" | "teen" | "adult";
  bodyColor?: string;
  eyeStyle?: "normal" | "sleepy" | "excited" | "cute";
  accessory?: "none" | "hat" | "bow" | "crown" | "glasses";
  mood?: "happy" | "excited" | "sleepy";
}) {
  
  // Egg stage
  if (stage === "egg") {
    return (
      <div style={{ position: "relative", width: "120px", height: "150px" }}>
        <div style={{
          position: "absolute",
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "100px",
          height: "130px",
          background: `linear-gradient(145deg, ${bodyColor}, ${adjustColor(bodyColor, -30)})`,
          borderRadius: "50px 50px 45px 45px",
          boxShadow: `0 10px 30px ${bodyColor}40`,
          animation: "wobble 2s ease-in-out infinite",
        }}>
          {/* Egg pattern */}
          <div style={{
            position: "absolute",
            top: "30%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "60%",
            height: "8px",
            background: "rgba(255,255,255,0.3)",
            borderRadius: "4px",
          }} />
          <div style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "40%",
            height: "8px",
            background: "rgba(255,255,255,0.2)",
            borderRadius: "4px",
          }} />
          {/* Crack lines appearing */}
          <div style={{
            position: "absolute",
            top: "20%",
            right: "20%",
            fontSize: "20px",
            opacity: 0.6,
          }}>✨</div>
        </div>
        <style jsx>{`
          @keyframes wobble {
            0%, 100% { transform: translateX(-50%) rotate(-2deg); }
            50% { transform: translateX(-50%) rotate(2deg); }
          }
        `}</style>
      </div>
    );
  }

  const sizes = {
    baby: { width: 100, height: 90, eyeSize: 24 },
    teen: { width: 130, height: 120, eyeSize: 28 },
    adult: { width: 160, height: 150, eyeSize: 32 },
  };

  const size = sizes[stage] || sizes.baby;

  // Eye styles
  const renderEyes = () => {
    const eyeY = stage === "adult" ? "35%" : "40%";
    
    if (eyeStyle === "sleepy") {
      return (
        <>
          <div style={{
            position: "absolute",
            top: eyeY,
            left: "25%",
            width: size.eyeSize,
            height: size.eyeSize / 2,
            background: "#1a1a2e",
            borderRadius: "0 0 50px 50px",
          }} />
          <div style={{
            position: "absolute",
            top: eyeY,
            right: "25%",
            width: size.eyeSize,
            height: size.eyeSize / 2,
            background: "#1a1a2e",
            borderRadius: "0 0 50px 50px",
          }} />
        </>
      );
    }
    
    if (eyeStyle === "excited") {
      return (
        <>
          <div style={{
            position: "absolute",
            top: eyeY,
            left: "25%",
            fontSize: size.eyeSize,
          }}>⭐</div>
          <div style={{
            position: "absolute",
            top: eyeY,
            right: "25%",
            fontSize: size.eyeSize,
          }}>⭐</div>
        </>
      );
    }

    if (eyeStyle === "cute") {
      return (
        <>
          <div style={{
            position: "absolute",
            top: eyeY,
            left: "22%",
            width: size.eyeSize,
            height: size.eyeSize,
            background: "#1a1a2e",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
            <div style={{
              width: "40%",
              height: "40%",
              background: "white",
              borderRadius: "50%",
              transform: "translate(-30%, -30%)",
            }} />
          </div>
          <div style={{
            position: "absolute",
            top: eyeY,
            right: "22%",
            width: size.eyeSize,
            height: size.eyeSize,
            background: "#1a1a2e",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
            <div style={{
              width: "40%",
              height: "40%",
              background: "white",
              borderRadius: "50%",
              transform: "translate(-30%, -30%)",
            }} />
          </div>
        </>
      );
    }

    // Normal eyes
    return (
      <>
        <div style={{
          position: "absolute",
          top: eyeY,
          left: "22%",
          width: size.eyeSize,
          height: size.eyeSize,
          background: "white",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          animation: "blink 3s ease-in-out infinite",
        }}>
          <div style={{
            width: "60%",
            height: "60%",
            background: "#1a1a2e",
            borderRadius: "50%",
          }} />
        </div>
        <div style={{
          position: "absolute",
          top: eyeY,
          right: "22%",
          width: size.eyeSize,
          height: size.eyeSize,
          background: "white",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          animation: "blink 3s ease-in-out infinite",
        }}>
          <div style={{
            width: "60%",
            height: "60%",
            background: "#1a1a2e",
            borderRadius: "50%",
          }} />
        </div>
      </>
    );
  };

  // Mouth based on mood
  const renderMouth = () => {
    const mouthY = stage === "adult" ? "65%" : "70%";
    
    if (mood === "excited") {
      return (
        <div style={{
          position: "absolute",
          top: mouthY,
          left: "50%",
          transform: "translateX(-50%)",
          width: size.width * 0.25,
          height: size.width * 0.2,
          background: "#ff6b9d",
          borderRadius: "0 0 50px 50px",
          border: "3px solid #1a1a2e",
          borderTop: "none",
        }} />
      );
    }
    
    if (mood === "sleepy") {
      return (
        <div style={{
          position: "absolute",
          top: mouthY,
          left: "50%",
          transform: "translateX(-50%)",
          width: size.width * 0.15,
          height: size.width * 0.08,
          background: "#1a1a2e",
          borderRadius: "50%",
        }} />
      );
    }

    // Happy smile
    return (
      <div style={{
        position: "absolute",
        top: mouthY,
        left: "50%",
        transform: "translateX(-50%)",
        width: size.width * 0.3,
        height: size.width * 0.15,
        borderBottom: "4px solid #1a1a2e",
        borderRadius: "0 0 50px 50px",
      }} />
    );
  };

  // Accessories
  const renderAccessory = () => {
    if (accessory === "hat") {
      return (
        <div style={{
          position: "absolute",
          top: "-15%",
          left: "50%",
          transform: "translateX(-50%)",
          width: size.width * 0.5,
          height: size.width * 0.4,
          background: "#ef4444",
          borderRadius: "50% 50% 0 0",
          zIndex: 10,
        }}>
          <div style={{
            position: "absolute",
            bottom: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: size.width * 0.8,
            height: size.width * 0.1,
            background: "#ef4444",
            borderRadius: "5px",
          }} />
        </div>
      );
    }
    
    if (accessory === "bow") {
      return (
        <div style={{
          position: "absolute",
          top: "-5%",
          right: "10%",
          fontSize: size.width * 0.3,
          zIndex: 10,
        }}>🎀</div>
      );
    }
    
    if (accessory === "crown") {
      return (
        <div style={{
          position: "absolute",
          top: "-18%",
          left: "50%",
          transform: "translateX(-50%)",
          fontSize: size.width * 0.35,
          zIndex: 10,
        }}>👑</div>
      );
    }
    
    if (accessory === "glasses") {
      return (
        <div style={{
          position: "absolute",
          top: "35%",
          left: "50%",
          transform: "translateX(-50%)",
          fontSize: size.width * 0.3,
          zIndex: 10,
        }}>🤓</div>
      );
    }
    
    return null;
  };

  // Small horns/ears for teen and adult
  const renderHorns = () => {
    if (stage === "baby") return null;
    
    return (
      <>
        <div style={{
          position: "absolute",
          top: stage === "adult" ? "-8%" : "-5%",
          left: "20%",
          width: 0,
          height: 0,
          borderLeft: `${size.width * 0.08}px solid transparent`,
          borderRight: `${size.width * 0.08}px solid transparent`,
          borderBottom: `${size.width * 0.2}px solid ${adjustColor(bodyColor, -20)}`,
          transform: "rotate(-15deg)",
        }} />
        <div style={{
          position: "absolute",
          top: stage === "adult" ? "-8%" : "-5%",
          right: "20%",
          width: 0,
          height: 0,
          borderLeft: `${size.width * 0.08}px solid transparent`,
          borderRight: `${size.width * 0.08}px solid transparent`,
          borderBottom: `${size.width * 0.2}px solid ${adjustColor(bodyColor, -20)}`,
          transform: "rotate(15deg)",
        }} />
      </>
    );
  };

  // Wings for adult
  const renderWings = () => {
    if (stage !== "adult") return null;
    
    return (
      <>
        <div style={{
          position: "absolute",
          top: "20%",
          left: "-25%",
          width: size.width * 0.4,
          height: size.width * 0.5,
          background: `linear-gradient(135deg, ${adjustColor(bodyColor, 20)}, ${bodyColor})`,
          borderRadius: "50% 0 50% 50%",
          transform: "rotate(-20deg)",
          animation: "flapLeft 1s ease-in-out infinite",
          zIndex: -1,
        }} />
        <div style={{
          position: "absolute",
          top: "20%",
          right: "-25%",
          width: size.width * 0.4,
          height: size.width * 0.5,
          background: `linear-gradient(225deg, ${adjustColor(bodyColor, 20)}, ${bodyColor})`,
          borderRadius: "0 50% 50% 50%",
          transform: "rotate(20deg)",
          animation: "flapRight 1s ease-in-out infinite",
          zIndex: -1,
        }} />
      </>
    );
  };

  return (
    <div style={{ 
      position: "relative", 
      width: size.width + 60, 
      height: size.height + 40,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}>
      {renderWings()}
      {renderAccessory()}
      <div style={{
        position: "relative",
        width: size.width,
        height: size.height,
        background: `linear-gradient(145deg, ${adjustColor(bodyColor, 20)}, ${bodyColor})`,
        borderRadius: stage === "baby" ? "50%" : "45% 45% 50% 50%",
        boxShadow: `0 10px 30px ${bodyColor}40`,
        animation: "bounce 2s ease-in-out infinite",
      }}>
        {renderHorns()}
        {renderEyes()}
        {renderMouth()}
        
        {/* Cheek blush */}
        <div style={{
          position: "absolute",
          top: "55%",
          left: "10%",
          width: size.width * 0.15,
          height: size.width * 0.08,
          background: "#ff9999",
          borderRadius: "50%",
          opacity: 0.6,
        }} />
        <div style={{
          position: "absolute",
          top: "55%",
          right: "10%",
          width: size.width * 0.15,
          height: size.width * 0.08,
          background: "#ff9999",
          borderRadius: "50%",
          opacity: 0.6,
        }} />

        {/* Belly highlight */}
        <div style={{
          position: "absolute",
          bottom: "15%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "50%",
          height: "30%",
          background: `${adjustColor(bodyColor, 30)}`,
          borderRadius: "50%",
          opacity: 0.5,
        }} />
      </div>

      <style jsx>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes blink {
          0%, 90%, 100% { transform: scaleY(1); }
          95% { transform: scaleY(0.1); }
        }
        @keyframes flapLeft {
          0%, 100% { transform: rotate(-20deg); }
          50% { transform: rotate(-35deg); }
        }
        @keyframes flapRight {
          0%, 100% { transform: rotate(20deg); }
          50% { transform: rotate(35deg); }
        }
      `}</style>
    </div>
  );
}

// Helper to adjust color brightness
function adjustColor(hex: string, amount: number): string {
  const num = parseInt(hex.replace("#", ""), 16);
  const r = Math.min(255, Math.max(0, (num >> 16) + amount));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00ff) + amount));
  const b = Math.min(255, Math.max(0, (num & 0x0000ff) + amount));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}

export default function CreatureDemo() {
  const [stage, setStage] = useState<"egg" | "baby" | "teen" | "adult">("baby");
  const [color, setColor] = useState("#8b5cf6");
  const [eyeStyle, setEyeStyle] = useState<"normal" | "sleepy" | "excited" | "cute">("normal");
  const [accessory, setAccessory] = useState<"none" | "hat" | "bow" | "crown" | "glasses">("none");
  const [mood, setMood] = useState<"happy" | "excited" | "sleepy">("happy");

  const colors = [
    { name: "Purple", value: "#8b5cf6" },
    { name: "Blue", value: "#3b82f6" },
    { name: "Green", value: "#10b981" },
    { name: "Pink", value: "#ec4899" },
    { name: "Orange", value: "#f97316" },
    { name: "Red", value: "#ef4444" },
    { name: "Teal", value: "#14b8a6" },
    { name: "Yellow", value: "#eab308" },
  ];

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #1a0533 0%, #2d1b69 50%, #4c1d95 100%)",
      padding: "40px 20px",
    }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <h1 style={{ fontSize: "36px", fontWeight: "700", color: "white", marginBottom: "8px" }}>
            🐉 KidVision Creatures
          </h1>
          <p style={{ color: "rgba(255,255,255,0.6)" }}>
            CSS-based creatures - fully customizable!
          </p>
        </div>

        {/* Creature Display */}
        <div style={{
          background: "rgba(255,255,255,0.1)",
          borderRadius: "24px",
          padding: "40px",
          marginBottom: "24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "250px",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255,255,255,0.2)",
        }}>
          <Creature 
            stage={stage}
            bodyColor={color}
            eyeStyle={eyeStyle}
            accessory={accessory}
            mood={mood}
          />
        </div>

        {/* Controls */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "16px",
        }}>
          {/* Stage */}
          <div style={{
            background: "rgba(255,255,255,0.1)",
            borderRadius: "16px",
            padding: "20px",
            backdropFilter: "blur(10px)",
          }}>
            <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "12px", marginBottom: "12px", textTransform: "uppercase" }}>
              Evolution Stage
            </div>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {(["egg", "baby", "teen", "adult"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setStage(s)}
                  style={{
                    padding: "8px 16px",
                    borderRadius: "8px",
                    border: "none",
                    background: stage === s ? "white" : "rgba(255,255,255,0.1)",
                    color: stage === s ? "#1a0533" : "white",
                    fontWeight: "600",
                    cursor: "pointer",
                    textTransform: "capitalize",
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Colors */}
          <div style={{
            background: "rgba(255,255,255,0.1)",
            borderRadius: "16px",
            padding: "20px",
            backdropFilter: "blur(10px)",
          }}>
            <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "12px", marginBottom: "12px", textTransform: "uppercase" }}>
              Body Color
            </div>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {colors.map((c) => (
                <button
                  key={c.value}
                  onClick={() => setColor(c.value)}
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    border: color === c.value ? "3px solid white" : "2px solid rgba(255,255,255,0.3)",
                    background: c.value,
                    cursor: "pointer",
                  }}
                  title={c.name}
                />
              ))}
            </div>
          </div>

          {/* Eye Style */}
          <div style={{
            background: "rgba(255,255,255,0.1)",
            borderRadius: "16px",
            padding: "20px",
            backdropFilter: "blur(10px)",
          }}>
            <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "12px", marginBottom: "12px", textTransform: "uppercase" }}>
              Eye Style
            </div>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {(["normal", "cute", "excited", "sleepy"] as const).map((e) => (
                <button
                  key={e}
                  onClick={() => setEyeStyle(e)}
                  style={{
                    padding: "8px 12px",
                    borderRadius: "8px",
                    border: "none",
                    background: eyeStyle === e ? "white" : "rgba(255,255,255,0.1)",
                    color: eyeStyle === e ? "#1a0533" : "white",
                    fontWeight: "500",
                    cursor: "pointer",
                    textTransform: "capitalize",
                    fontSize: "13px",
                  }}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          {/* Accessories */}
          <div style={{
            background: "rgba(255,255,255,0.1)",
            borderRadius: "16px",
            padding: "20px",
            backdropFilter: "blur(10px)",
          }}>
            <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "12px", marginBottom: "12px", textTransform: "uppercase" }}>
              Accessory (50 pts each)
            </div>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {(["none", "hat", "bow", "crown", "glasses"] as const).map((a) => (
                <button
                  key={a}
                  onClick={() => setAccessory(a)}
                  style={{
                    padding: "8px 12px",
                    borderRadius: "8px",
                    border: "none",
                    background: accessory === a ? "white" : "rgba(255,255,255,0.1)",
                    color: accessory === a ? "#1a0533" : "white",
                    fontWeight: "500",
                    cursor: "pointer",
                    textTransform: "capitalize",
                    fontSize: "13px",
                  }}
                >
                  {a === "none" ? "None" : a === "hat" ? "🎩 Hat" : a === "bow" ? "🎀 Bow" : a === "crown" ? "👑 Crown" : "🤓 Glasses"}
                </button>
              ))}
            </div>
          </div>

          {/* Mood */}
          <div style={{
            background: "rgba(255,255,255,0.1)",
            borderRadius: "16px",
            padding: "20px",
            backdropFilter: "blur(10px)",
          }}>
            <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "12px", marginBottom: "12px", textTransform: "uppercase" }}>
              Mood
            </div>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {(["happy", "excited", "sleepy"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setMood(m)}
                  style={{
                    padding: "8px 12px",
                    borderRadius: "8px",
                    border: "none",
                    background: mood === m ? "white" : "rgba(255,255,255,0.1)",
                    color: mood === m ? "#1a0533" : "white",
                    fontWeight: "500",
                    cursor: "pointer",
                    textTransform: "capitalize",
                    fontSize: "13px",
                  }}
                >
                  {m === "happy" ? "😊 Happy" : m === "excited" ? "🤩 Excited" : "😴 Sleepy"}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Info */}
        <div style={{
          marginTop: "24px",
          textAlign: "center",
          color: "rgba(255,255,255,0.5)",
          fontSize: "14px",
        }}>
          100% CSS/Code - No images needed! • Smooth animations • Fully customizable
        </div>
      </div>
    </div>
  );
}
