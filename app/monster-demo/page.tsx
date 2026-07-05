"use client";

import { useState } from "react";

// More detailed Monster component - Monsters Inc style
function Monster({ 
  stage = "baby",
  bodyColor = "#8b5cf6",
  bodyType = "round",
  eyeCount = 2,
  eyeStyle = "normal",
  accessory = "none",
  mood = "happy",
  skinPattern = "none",
}: {
  stage?: "egg" | "baby" | "teen" | "adult";
  bodyColor?: string;
  bodyType?: "round" | "tall" | "wide" | "fuzzy";
  eyeCount?: 1 | 2 | 3;
  eyeStyle?: "normal" | "sleepy" | "excited" | "cute";
  accessory?: "none" | "hat" | "bow" | "crown" | "glasses" | "horns" | "antenna";
  mood?: "happy" | "excited" | "sleepy" | "silly";
  skinPattern?: "none" | "spots" | "stripes" | "scales";
}) {
  
  // Egg stage
  if (stage === "egg") {
    return (
      <div style={{ position: "relative", width: "140px", height: "180px" }}>
        <div style={{
          position: "absolute",
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "110px",
          height: "145px",
          background: `linear-gradient(145deg, ${bodyColor}, ${adjustColor(bodyColor, -30)})`,
          borderRadius: "55px 55px 50px 50px",
          boxShadow: `0 10px 40px ${bodyColor}50, inset 0 -20px 40px ${adjustColor(bodyColor, -40)}40`,
          animation: "wobble 2s ease-in-out infinite",
        }}>
          {/* Egg patterns */}
          <div style={{
            position: "absolute",
            top: "25%",
            left: "15%",
            width: "70%",
            height: "12px",
            background: `${adjustColor(bodyColor, 30)}`,
            borderRadius: "6px",
            opacity: 0.5,
          }} />
          <div style={{
            position: "absolute",
            top: "45%",
            left: "25%",
            width: "50%",
            height: "10px",
            background: `${adjustColor(bodyColor, 20)}`,
            borderRadius: "5px",
            opacity: 0.4,
          }} />
          {/* Crack */}
          <svg style={{ position: "absolute", top: "15%", right: "15%", width: "30px", height: "40px" }}>
            <path d="M15 0 L20 15 L10 20 L18 35" stroke="rgba(0,0,0,0.2)" strokeWidth="3" fill="none" />
          </svg>
          {/* Sparkle */}
          <div style={{ position: "absolute", top: "10%", left: "20%", fontSize: "24px", animation: "sparkle 1.5s ease-in-out infinite" }}>✨</div>
        </div>
        <style jsx>{`
          @keyframes wobble {
            0%, 100% { transform: translateX(-50%) rotate(-3deg); }
            50% { transform: translateX(-50%) rotate(3deg); }
          }
          @keyframes sparkle {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.5; transform: scale(0.8); }
          }
        `}</style>
      </div>
    );
  }

  const sizes = {
    baby: { width: 120, height: 130, limbSize: 0.3 },
    teen: { width: 150, height: 170, limbSize: 0.35 },
    adult: { width: 180, height: 210, limbSize: 0.4 },
  };

  const size = sizes[stage] || sizes.baby;

  // Body shapes
  const getBodyStyle = () => {
    const base = {
      background: `linear-gradient(145deg, ${adjustColor(bodyColor, 25)}, ${bodyColor}, ${adjustColor(bodyColor, -20)})`,
      boxShadow: `0 15px 40px ${bodyColor}40, inset 0 -30px 60px ${adjustColor(bodyColor, -30)}30`,
    };
    
    switch (bodyType) {
      case "tall":
        return { ...base, width: size.width * 0.7, height: size.height * 1.2, borderRadius: "40% 40% 45% 45%" };
      case "wide":
        return { ...base, width: size.width * 1.2, height: size.height * 0.8, borderRadius: "50% 50% 45% 45%" };
      case "fuzzy":
        return { ...base, width: size.width, height: size.height, borderRadius: "50%", 
          boxShadow: `0 15px 40px ${bodyColor}40, 0 0 0 8px ${adjustColor(bodyColor, 15)}, 0 0 0 16px ${adjustColor(bodyColor, 25)}30` };
      default:
        return { ...base, width: size.width, height: size.height, borderRadius: "50% 50% 45% 45%" };
    }
  };

  // Render pattern overlay
  const renderPattern = () => {
    if (skinPattern === "spots") {
      return (
        <div style={{ position: "absolute", inset: 0, overflow: "hidden", borderRadius: "inherit" }}>
          {[...Array(6)].map((_, i) => (
            <div key={i} style={{
              position: "absolute",
              width: `${15 + Math.random() * 20}%`,
              height: `${15 + Math.random() * 20}%`,
              background: adjustColor(bodyColor, -30),
              borderRadius: "50%",
              top: `${10 + (i % 3) * 30}%`,
              left: `${10 + (i % 2) * 40 + Math.random() * 20}%`,
              opacity: 0.4,
            }} />
          ))}
        </div>
      );
    }
    if (skinPattern === "stripes") {
      return (
        <div style={{ position: "absolute", inset: 0, overflow: "hidden", borderRadius: "inherit" }}>
          {[...Array(5)].map((_, i) => (
            <div key={i} style={{
              position: "absolute",
              width: "100%",
              height: "8%",
              background: adjustColor(bodyColor, -25),
              top: `${20 + i * 15}%`,
              opacity: 0.3,
            }} />
          ))}
        </div>
      );
    }
    if (skinPattern === "scales") {
      return (
        <div style={{ 
          position: "absolute", 
          inset: 0, 
          overflow: "hidden", 
          borderRadius: "inherit",
          background: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 10px,
            ${adjustColor(bodyColor, -20)}30 10px,
            ${adjustColor(bodyColor, -20)}30 12px
          )`,
        }} />
      );
    }
    return null;
  };

  // Eyes based on count and style
  const renderEyes = () => {
    const eyeY = bodyType === "tall" ? "30%" : "35%";
    const eyeSize = size.width * 0.22;
    
    const EyeComponent = ({ left, size: eyeS }: { left: string; size: number }) => {
      if (eyeStyle === "sleepy") {
        return (
          <div style={{
            position: "absolute",
            top: eyeY,
            left,
            width: eyeS,
            height: eyeS,
            background: "white",
            borderRadius: "50%",
            boxShadow: "inset 0 -5px 15px rgba(0,0,0,0.1)",
            overflow: "hidden",
          }}>
            <div style={{
              position: "absolute",
              top: "50%",
              left: 0,
              right: 0,
              height: "60%",
              background: "linear-gradient(180deg, #1a1a2e, #2d2d44)",
              borderRadius: "0 0 50% 50%",
            }} />
          </div>
        );
      }
      
      if (eyeStyle === "excited") {
        return (
          <div style={{
            position: "absolute",
            top: eyeY,
            left,
            width: eyeS,
            height: eyeS,
            background: "white",
            borderRadius: "50%",
            boxShadow: "inset 0 -5px 15px rgba(0,0,0,0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
            <div style={{ fontSize: eyeS * 0.7 }}>⭐</div>
          </div>
        );
      }

      // Normal/Cute eyes with pupils
      return (
        <div style={{
          position: "absolute",
          top: eyeY,
          left,
          width: eyeS,
          height: eyeS,
          background: "white",
          borderRadius: "50%",
          boxShadow: "inset 0 -5px 15px rgba(0,0,0,0.1), 0 4px 8px rgba(0,0,0,0.2)",
          animation: "blink 4s ease-in-out infinite",
        }}>
          {/* Iris */}
          <div style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "65%",
            height: "65%",
            background: eyeStyle === "cute" ? "#4a90d9" : "#1a1a2e",
            borderRadius: "50%",
          }}>
            {/* Pupil */}
            <div style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "50%",
              height: "50%",
              background: "#000",
              borderRadius: "50%",
            }} />
            {/* Highlight */}
            <div style={{
              position: "absolute",
              top: "20%",
              left: "20%",
              width: "30%",
              height: "30%",
              background: "white",
              borderRadius: "50%",
            }} />
          </div>
        </div>
      );
    };

    if (eyeCount === 1) {
      return <EyeComponent left="50%" size={eyeSize * 1.5} />;
    }
    if (eyeCount === 3) {
      return (
        <>
          <EyeComponent left="15%" size={eyeSize * 0.8} />
          <EyeComponent left="50%" size={eyeSize} />
          <EyeComponent left="75%" size={eyeSize * 0.8} />
        </>
      );
    }
    // Default 2 eyes
    return (
      <>
        <EyeComponent left="20%" size={eyeSize} />
        <EyeComponent left="55%" size={eyeSize} />
      </>
    );
  };

  // Mouth based on mood
  const renderMouth = () => {
    const mouthY = bodyType === "tall" ? "60%" : "65%";
    const mouthWidth = size.width * 0.35;
    
    if (mood === "excited") {
      return (
        <div style={{
          position: "absolute",
          top: mouthY,
          left: "50%",
          transform: "translateX(-50%)",
          width: mouthWidth,
          height: mouthWidth * 0.7,
          background: "#ff6b9d",
          borderRadius: "10px 10px 50% 50%",
          border: "3px solid #1a1a2e",
          overflow: "hidden",
        }}>
          {/* Tongue */}
          <div style={{
            position: "absolute",
            bottom: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: "50%",
            height: "60%",
            background: "#ff8fab",
            borderRadius: "50% 50% 0 0",
          }} />
          {/* Teeth */}
          <div style={{
            position: "absolute",
            top: 0,
            left: "10%",
            width: "20%",
            height: "25%",
            background: "white",
            borderRadius: "0 0 5px 5px",
          }} />
          <div style={{
            position: "absolute",
            top: 0,
            right: "10%",
            width: "20%",
            height: "25%",
            background: "white",
            borderRadius: "0 0 5px 5px",
          }} />
        </div>
      );
    }
    
    if (mood === "silly") {
      return (
        <div style={{
          position: "absolute",
          top: mouthY,
          left: "50%",
          transform: "translateX(-50%)",
        }}>
          <div style={{
            width: mouthWidth * 0.8,
            height: mouthWidth * 0.5,
            background: "#ff6b9d",
            borderRadius: "50%",
            border: "3px solid #1a1a2e",
          }} />
          {/* Tongue sticking out */}
          <div style={{
            position: "absolute",
            top: "60%",
            left: "50%",
            transform: "translateX(-50%)",
            width: mouthWidth * 0.4,
            height: mouthWidth * 0.5,
            background: "#ff8fab",
            borderRadius: "40% 40% 50% 50%",
            animation: "tongueWag 0.5s ease-in-out infinite",
          }} />
        </div>
      );
    }
    
    if (mood === "sleepy") {
      return (
        <div style={{
          position: "absolute",
          top: mouthY,
          left: "50%",
          transform: "translateX(-50%)",
          width: mouthWidth * 0.4,
          height: mouthWidth * 0.25,
          background: "#1a1a2e",
          borderRadius: "50%",
        }} />
      );
    }

    // Happy smile with teeth
    return (
      <div style={{
        position: "absolute",
        top: mouthY,
        left: "50%",
        transform: "translateX(-50%)",
        width: mouthWidth,
        height: mouthWidth * 0.45,
        background: "#ff6b9d",
        borderRadius: "0 0 50% 50%",
        border: "3px solid #1a1a2e",
        borderTop: "none",
        overflow: "hidden",
      }}>
        {/* Teeth row */}
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "35%",
          background: "white",
          borderRadius: "0 0 10px 10px",
        }} />
      </div>
    );
  };

  // Arms
  const renderArms = () => {
    const armLength = size.width * size.limbSize;
    const armWidth = armLength * 0.5;
    
    return (
      <>
        {/* Left arm */}
        <div style={{
          position: "absolute",
          top: "45%",
          left: bodyType === "wide" ? "-15%" : "-20%",
          width: armLength,
          height: armWidth,
          background: `linear-gradient(180deg, ${adjustColor(bodyColor, 10)}, ${bodyColor})`,
          borderRadius: "50%",
          transform: "rotate(-20deg)",
          animation: "waveLeft 2s ease-in-out infinite",
          transformOrigin: "right center",
          boxShadow: `0 4px 8px ${bodyColor}40`,
        }}>
          {/* Hand */}
          <div style={{
            position: "absolute",
            left: "-10%",
            top: "50%",
            transform: "translateY(-50%)",
            width: armWidth * 1.2,
            height: armWidth * 1.2,
            background: `linear-gradient(145deg, ${adjustColor(bodyColor, 15)}, ${bodyColor})`,
            borderRadius: "50%",
          }}>
            {/* Fingers */}
            {[0, 1, 2].map((i) => (
              <div key={i} style={{
                position: "absolute",
                left: `${-20 + i * 10}%`,
                top: `${20 + i * 20}%`,
                width: "35%",
                height: "25%",
                background: bodyColor,
                borderRadius: "50%",
              }} />
            ))}
          </div>
        </div>

        {/* Right arm */}
        <div style={{
          position: "absolute",
          top: "45%",
          right: bodyType === "wide" ? "-15%" : "-20%",
          width: armLength,
          height: armWidth,
          background: `linear-gradient(180deg, ${adjustColor(bodyColor, 10)}, ${bodyColor})`,
          borderRadius: "50%",
          transform: "rotate(20deg)",
          animation: "waveRight 2s ease-in-out infinite 0.5s",
          transformOrigin: "left center",
          boxShadow: `0 4px 8px ${bodyColor}40`,
        }}>
          {/* Hand */}
          <div style={{
            position: "absolute",
            right: "-10%",
            top: "50%",
            transform: "translateY(-50%)",
            width: armWidth * 1.2,
            height: armWidth * 1.2,
            background: `linear-gradient(145deg, ${adjustColor(bodyColor, 15)}, ${bodyColor})`,
            borderRadius: "50%",
          }}>
            {[0, 1, 2].map((i) => (
              <div key={i} style={{
                position: "absolute",
                right: `${-20 + i * 10}%`,
                top: `${20 + i * 20}%`,
                width: "35%",
                height: "25%",
                background: bodyColor,
                borderRadius: "50%",
              }} />
            ))}
          </div>
        </div>
      </>
    );
  };

  // Legs
  const renderLegs = () => {
    const legWidth = size.width * 0.25;
    const legHeight = size.height * 0.35;
    
    return (
      <>
        {/* Left leg */}
        <div style={{
          position: "absolute",
          bottom: `-${legHeight * 0.7}px`,
          left: "15%",
          width: legWidth,
          height: legHeight,
          background: `linear-gradient(180deg, ${bodyColor}, ${adjustColor(bodyColor, -15)})`,
          borderRadius: "30% 30% 50% 50%",
          animation: "walkLeft 1s ease-in-out infinite",
          transformOrigin: "top center",
          boxShadow: `0 8px 15px ${bodyColor}30`,
        }}>
          {/* Foot */}
          <div style={{
            position: "absolute",
            bottom: 0,
            left: "-20%",
            width: "140%",
            height: "35%",
            background: `linear-gradient(180deg, ${adjustColor(bodyColor, -10)}, ${adjustColor(bodyColor, -25)})`,
            borderRadius: "50% 50% 40% 40%",
          }}>
            {/* Toes */}
            {[0, 1, 2].map((i) => (
              <div key={i} style={{
                position: "absolute",
                bottom: "-15%",
                left: `${15 + i * 25}%`,
                width: "25%",
                height: "40%",
                background: adjustColor(bodyColor, -20),
                borderRadius: "50%",
              }} />
            ))}
          </div>
        </div>

        {/* Right leg */}
        <div style={{
          position: "absolute",
          bottom: `-${legHeight * 0.7}px`,
          right: "15%",
          width: legWidth,
          height: legHeight,
          background: `linear-gradient(180deg, ${bodyColor}, ${adjustColor(bodyColor, -15)})`,
          borderRadius: "30% 30% 50% 50%",
          animation: "walkRight 1s ease-in-out infinite 0.5s",
          transformOrigin: "top center",
          boxShadow: `0 8px 15px ${bodyColor}30`,
        }}>
          {/* Foot */}
          <div style={{
            position: "absolute",
            bottom: 0,
            left: "-20%",
            width: "140%",
            height: "35%",
            background: `linear-gradient(180deg, ${adjustColor(bodyColor, -10)}, ${adjustColor(bodyColor, -25)})`,
            borderRadius: "50% 50% 40% 40%",
          }}>
            {[0, 1, 2].map((i) => (
              <div key={i} style={{
                position: "absolute",
                bottom: "-15%",
                left: `${15 + i * 25}%`,
                width: "25%",
                height: "40%",
                background: adjustColor(bodyColor, -20),
                borderRadius: "50%",
              }} />
            ))}
          </div>
        </div>
      </>
    );
  };

  // Accessories
  const renderAccessory = () => {
    if (accessory === "hat") {
      return (
        <div style={{
          position: "absolute",
          top: "-20%",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 10,
        }}>
          <div style={{
            width: size.width * 0.5,
            height: size.width * 0.45,
            background: "linear-gradient(180deg, #ef4444, #dc2626)",
            borderRadius: "50% 50% 0 0",
          }} />
          <div style={{
            width: size.width * 0.8,
            height: size.width * 0.12,
            background: "#1a1a2e",
            borderRadius: "10px",
            marginTop: "-2px",
          }} />
        </div>
      );
    }
    
    if (accessory === "crown") {
      return (
        <div style={{
          position: "absolute",
          top: "-22%",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 10,
        }}>
          <svg width={size.width * 0.6} height={size.width * 0.4} viewBox="0 0 60 40">
            <path d="M5 35 L10 10 L20 25 L30 5 L40 25 L50 10 L55 35 Z" 
              fill="url(#gold)" stroke="#b8860b" strokeWidth="2" />
            <defs>
              <linearGradient id="gold" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ffd700" />
                <stop offset="50%" stopColor="#ffec8b" />
                <stop offset="100%" stopColor="#daa520" />
              </linearGradient>
            </defs>
            <circle cx="30" cy="18" r="5" fill="#e74c3c" />
            <circle cx="15" cy="25" r="3" fill="#3498db" />
            <circle cx="45" cy="25" r="3" fill="#2ecc71" />
          </svg>
        </div>
      );
    }
    
    if (accessory === "bow") {
      return (
        <div style={{
          position: "absolute",
          top: "-5%",
          right: "5%",
          fontSize: size.width * 0.35,
          zIndex: 10,
        }}>🎀</div>
      );
    }
    
    if (accessory === "horns") {
      return (
        <>
          <div style={{
            position: "absolute",
            top: "-15%",
            left: "15%",
            width: size.width * 0.12,
            height: size.width * 0.3,
            background: `linear-gradient(180deg, #8b4513, #654321)`,
            borderRadius: "50% 50% 30% 30%",
            transform: "rotate(-20deg)",
            zIndex: 10,
          }} />
          <div style={{
            position: "absolute",
            top: "-15%",
            right: "15%",
            width: size.width * 0.12,
            height: size.width * 0.3,
            background: `linear-gradient(180deg, #8b4513, #654321)`,
            borderRadius: "50% 50% 30% 30%",
            transform: "rotate(20deg)",
            zIndex: 10,
          }} />
        </>
      );
    }
    
    if (accessory === "antenna") {
      return (
        <>
          <div style={{
            position: "absolute",
            top: "-25%",
            left: "30%",
            width: "4px",
            height: size.width * 0.3,
            background: bodyColor,
            borderRadius: "2px",
            transform: "rotate(-15deg)",
            zIndex: 10,
          }}>
            <div style={{
              position: "absolute",
              top: "-10px",
              left: "-8px",
              width: "20px",
              height: "20px",
              background: adjustColor(bodyColor, 30),
              borderRadius: "50%",
              animation: "glow 1s ease-in-out infinite",
            }} />
          </div>
          <div style={{
            position: "absolute",
            top: "-25%",
            right: "30%",
            width: "4px",
            height: size.width * 0.3,
            background: bodyColor,
            borderRadius: "2px",
            transform: "rotate(15deg)",
            zIndex: 10,
          }}>
            <div style={{
              position: "absolute",
              top: "-10px",
              left: "-8px",
              width: "20px",
              height: "20px",
              background: adjustColor(bodyColor, 30),
              borderRadius: "50%",
              animation: "glow 1s ease-in-out infinite 0.5s",
            }} />
          </div>
        </>
      );
    }
    
    if (accessory === "glasses") {
      return (
        <div style={{
          position: "absolute",
          top: "32%",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 15,
        }}>
          <svg width={size.width * 0.8} height={size.width * 0.3} viewBox="0 0 80 30">
            <circle cx="20" cy="15" r="12" fill="none" stroke="#1a1a2e" strokeWidth="3" />
            <circle cx="60" cy="15" r="12" fill="none" stroke="#1a1a2e" strokeWidth="3" />
            <path d="M32 15 L48 15" stroke="#1a1a2e" strokeWidth="3" />
            <path d="M8 15 L0 12" stroke="#1a1a2e" strokeWidth="3" />
            <path d="M72 15 L80 12" stroke="#1a1a2e" strokeWidth="3" />
          </svg>
        </div>
      );
    }
    
    return null;
  };

  // Belly
  const renderBelly = () => (
    <div style={{
      position: "absolute",
      bottom: "20%",
      left: "50%",
      transform: "translateX(-50%)",
      width: "55%",
      height: "40%",
      background: `radial-gradient(ellipse, ${adjustColor(bodyColor, 35)} 0%, ${adjustColor(bodyColor, 20)} 70%, transparent 100%)`,
      borderRadius: "50%",
      opacity: 0.7,
    }} />
  );

  const bodyStyle = getBodyStyle();

  return (
    <div style={{ 
      position: "relative", 
      width: (bodyStyle.width as number) + 80, 
      height: (bodyStyle.height as number) + 100,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      paddingBottom: "60px",
    }}>
      {renderAccessory()}
      {renderArms()}
      
      <div style={{
        position: "relative",
        ...bodyStyle,
        animation: "idle 2s ease-in-out infinite",
      }}>
        {renderPattern()}
        {renderBelly()}
        {renderEyes()}
        {renderMouth()}
        
        {/* Cheek blush */}
        <div style={{
          position: "absolute",
          top: "52%",
          left: "8%",
          width: "18%",
          height: "10%",
          background: "radial-gradient(ellipse, #ff9999 0%, transparent 70%)",
          borderRadius: "50%",
          opacity: 0.7,
        }} />
        <div style={{
          position: "absolute",
          top: "52%",
          right: "8%",
          width: "18%",
          height: "10%",
          background: "radial-gradient(ellipse, #ff9999 0%, transparent 70%)",
          borderRadius: "50%",
          opacity: 0.7,
        }} />
      </div>
      
      {renderLegs()}

      <style jsx>{`
        @keyframes idle {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          25% { transform: translateY(-5px) rotate(-1deg); }
          75% { transform: translateY(-5px) rotate(1deg); }
        }
        @keyframes blink {
          0%, 90%, 100% { transform: scaleY(1); }
          95% { transform: scaleY(0.1); }
        }
        @keyframes waveLeft {
          0%, 100% { transform: rotate(-20deg); }
          50% { transform: rotate(-35deg); }
        }
        @keyframes waveRight {
          0%, 100% { transform: rotate(20deg); }
          50% { transform: rotate(35deg); }
        }
        @keyframes walkLeft {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(-8deg); }
        }
        @keyframes walkRight {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(8deg); }
        }
        @keyframes tongueWag {
          0%, 100% { transform: translateX(-50%) rotate(-5deg); }
          50% { transform: translateX(-50%) rotate(5deg); }
        }
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 5px 2px rgba(255,255,255,0.5); }
          50% { box-shadow: 0 0 15px 5px rgba(255,255,255,0.8); }
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

export default function MonsterDemo() {
  const [stage, setStage] = useState<"egg" | "baby" | "teen" | "adult">("teen");
  const [color, setColor] = useState("#8b5cf6");
  const [bodyType, setBodyType] = useState<"round" | "tall" | "wide" | "fuzzy">("round");
  const [eyeCount, setEyeCount] = useState<1 | 2 | 3>(2);
  const [eyeStyle, setEyeStyle] = useState<"normal" | "sleepy" | "excited" | "cute">("normal");
  const [accessory, setAccessory] = useState<"none" | "hat" | "bow" | "crown" | "glasses" | "horns" | "antenna">("none");
  const [mood, setMood] = useState<"happy" | "excited" | "sleepy" | "silly">("happy");
  const [skinPattern, setSkinPattern] = useState<"none" | "spots" | "stripes" | "scales">("none");

  const colors = [
    { name: "Purple", value: "#8b5cf6" },
    { name: "Blue", value: "#3b82f6" },
    { name: "Green", value: "#10b981" },
    { name: "Turquoise", value: "#06b6d4" },
    { name: "Pink", value: "#ec4899" },
    { name: "Orange", value: "#f97316" },
    { name: "Red", value: "#ef4444" },
    { name: "Lime", value: "#84cc16" },
    { name: "Yellow", value: "#eab308" },
    { name: "Fuchsia", value: "#d946ef" },
  ];

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #1a0533 0%, #2d1b69 50%, #4c1d95 100%)",
      padding: "40px 20px",
    }}>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <h1 style={{ fontSize: "36px", fontWeight: "700", color: "white", marginBottom: "8px" }}>
            👹 KidVision Monsters
          </h1>
          <p style={{ color: "rgba(255,255,255,0.6)" }}>
            Monsters Inc style - Arms, legs & personality!
          </p>
        </div>

        {/* Monster Display */}
        <div style={{
          background: "rgba(255,255,255,0.1)",
          borderRadius: "24px",
          padding: "60px 40px",
          marginBottom: "24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "350px",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255,255,255,0.2)",
        }}>
          <Monster 
            stage={stage}
            bodyColor={color}
            bodyType={bodyType}
            eyeCount={eyeCount}
            eyeStyle={eyeStyle}
            accessory={accessory}
            mood={mood}
            skinPattern={skinPattern}
          />
        </div>

        {/* Controls Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "12px",
        }}>
          {/* Stage */}
          <ControlPanel title="Evolution">
            {(["egg", "baby", "teen", "adult"] as const).map((s) => (
              <Btn key={s} active={stage === s} onClick={() => setStage(s)}>{s}</Btn>
            ))}
          </ControlPanel>

          {/* Body Type */}
          <ControlPanel title="Body Shape">
            {(["round", "tall", "wide", "fuzzy"] as const).map((b) => (
              <Btn key={b} active={bodyType === b} onClick={() => setBodyType(b)}>{b}</Btn>
            ))}
          </ControlPanel>

          {/* Eye Count */}
          <ControlPanel title="Eyes">
            {([1, 2, 3] as const).map((e) => (
              <Btn key={e} active={eyeCount === e} onClick={() => setEyeCount(e)}>{e} 👁️</Btn>
            ))}
          </ControlPanel>

          {/* Eye Style */}
          <ControlPanel title="Eye Style">
            {(["normal", "cute", "excited", "sleepy"] as const).map((e) => (
              <Btn key={e} active={eyeStyle === e} onClick={() => setEyeStyle(e)}>{e}</Btn>
            ))}
          </ControlPanel>

          {/* Mood */}
          <ControlPanel title="Mood">
            {(["happy", "excited", "sleepy", "silly"] as const).map((m) => (
              <Btn key={m} active={mood === m} onClick={() => setMood(m)}>{m}</Btn>
            ))}
          </ControlPanel>

          {/* Pattern */}
          <ControlPanel title="Skin Pattern">
            {(["none", "spots", "stripes", "scales"] as const).map((p) => (
              <Btn key={p} active={skinPattern === p} onClick={() => setSkinPattern(p)}>{p}</Btn>
            ))}
          </ControlPanel>

          {/* Accessories */}
          <ControlPanel title="Accessory" wide>
            {(["none", "hat", "crown", "bow", "glasses", "horns", "antenna"] as const).map((a) => (
              <Btn key={a} active={accessory === a} onClick={() => setAccessory(a)}>
                {a === "none" ? "None" : a === "hat" ? "🎩" : a === "crown" ? "👑" : a === "bow" ? "🎀" : a === "glasses" ? "👓" : a === "horns" ? "😈" : "📡"}
              </Btn>
            ))}
          </ControlPanel>

          {/* Colors */}
          <ControlPanel title="Color" wide>
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
                    transition: "transform 0.2s",
                  }}
                  title={c.name}
                />
              ))}
            </div>
          </ControlPanel>
        </div>

        {/* Info */}
        <div style={{
          marginTop: "24px",
          textAlign: "center",
          color: "rgba(255,255,255,0.5)",
          fontSize: "14px",
        }}>
          100% CSS/Code • Arms, Legs, Fingers & Toes • Multiple Animations • Fully Customizable
        </div>
      </div>
    </div>
  );
}

// Helper components
function ControlPanel({ title, children, wide }: { title: string; children: React.ReactNode; wide?: boolean }) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.1)",
      borderRadius: "14px",
      padding: "14px",
      backdropFilter: "blur(10px)",
      gridColumn: wide ? "span 2" : "span 1",
    }}>
      <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "11px", marginBottom: "10px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
        {title}
      </div>
      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
        {children}
      </div>
    </div>
  );
}

function Btn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "6px 12px",
        borderRadius: "8px",
        border: "none",
        background: active ? "white" : "rgba(255,255,255,0.15)",
        color: active ? "#1a0533" : "white",
        fontWeight: "500",
        cursor: "pointer",
        fontSize: "12px",
        textTransform: "capitalize",
        transition: "all 0.2s",
      }}
    >
      {children}
    </button>
  );
}
