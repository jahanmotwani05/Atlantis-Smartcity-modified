import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const AnimatedTagline: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Create arrays of span elements for the title
    const titleText = "Atlantis";
    const titleLetters = titleRef.current!.children;
    
    // Create arrays of span elements for the subtitle
    const subtitleText = "A Smart Paradise";
    const subtitleLetters = subtitleRef.current!.children;

    // Title animation
    gsap.fromTo(titleLetters, 
      {
        opacity: 0,
        scale: 0,
        y: 100,
        rotationX: 180
      },
      {
        duration: 1,
        opacity: 1,
        scale: 1,
        y: 0,
        rotationX: 0,
        stagger: 0.1,
        ease: "back.out(1.7)",
        transformOrigin: "0% 50% -50"
      }
    );

    // Subtitle animation
    gsap.fromTo(subtitleLetters,
      {
        opacity: 0,
        y: 20
      },
      {
        duration: 1,
        opacity: 1,
        y: 0,
        stagger: 0.05,
        ease: "power4.out",
        delay: 0.5
      }
    );

    // Subtle hover animation for the title
    gsap.to(titleRef.current, {
      duration: 2,
      scale: 1.05,
      ease: "power1.inOut",
      repeat: -1,
      yoyo: true
    });

  }, []);

  return (
    <>
      <style>
        {`
          @keyframes gradient-shift {
            0%, 100% {
              background-size: 200% 200%;
              background-position: left center;
            }
            50% {
              background-size: 200% 200%;
              background-position: right center;
            }
          }

          @keyframes blob {
            0% {
              transform: translate(0px, 0px) scale(1);
            }
            33% {
              transform: translate(30px, -50px) scale(1.1);
            }
            66% {
              transform: translate(-20px, 20px) scale(0.9);
            }
            100% {
              transform: translate(0px, 0px) scale(1);
            }
          }

          .tagline-container {
            position: relative;
            min-height: 60vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            padding: 2rem;
          }

          .gradient-bg {
            position: absolute;
            inset: 0;
            background: radial-gradient(circle at top left, rgba(6, 58, 199, 0.15), transparent 80%),
                        radial-gradient(circle at bottom right, rgba(147, 51, 234, 0.15), transparent 80%);
            animation: gradient-shift 8s ease infinite;
          }

          .main-title {
            font-size: clamp(3rem, 10vw, 9rem);
            font-weight: 450;
            margin-bottom: 1.5rem;
            line-height: 1.1;
            position: relative;
            z-index: 10;
            font-family: 'Syncopate', sans-serif;  // Changed from Space Grotesk to Syncopate
            letter-spacing: 0.1em;  // Added letter spacing to match navbar
            display: flex;
            justify-content: center;
            text-transform: uppercase;  // Added to match navbar style
          }

          .title-letter {
            display: inline-block;
            background: linear-gradient(to right, #60A5FA, #3B82F6);
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
            filter: drop-shadow(0 0 30px rgba(215, 219, 224, 0.2));
          }

          .sub-title {
            font-size: clamp(1rem, 3vw, 1.875rem);
            color: rgb(216, 220, 227);
            letter-spacing: 0.2em;
            font-family: 'Syncopate', sans-serif;
            position: relative;
            z-index: 10;
            text-transform: uppercase;
            display: flex;
            justify-content: center;
            gap: 0.5rem;
          }

          .subtitle-letter {
            display: inline-block;
          }

          .blob {
            position: absolute;
            width: 16rem;
            height: 16rem;
            border-radius: 50%;
            filter: blur(40px);
            opacity: 0.4;
            pointer-events: none;
          }

          .blob-1 {
            top: 25%;
            left: 25%;
            background: rgba(59, 130, 246, 0.3);
            animation: blob 7s infinite;
          }

          .blob-2 {
            top: 33%;
            right: 25%;
            background: rgba(147, 51, 234, 0.3);
            animation: blob 7s infinite;
            animation-delay: 2s;
          }

          .blob-3 {
            bottom: 25%;
            left: 33%;
            background: rgba(236, 72, 153, 0.3);
            animation: blob 7s infinite;
            animation-delay: 4s;
          }

          .grain-overlay {
            position: absolute;
            inset: 0;
            background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
            opacity: 0.05;
            pointer-events: none;
          }
        `}
      </style>

      <div className="tagline-container" ref={containerRef}>
        <div className="gradient-bg" />
        <div className="grain-overlay" />

        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />

        <div ref={titleRef} className="main-title">
          {"Atlantis".split('').map((letter, index) => (
            <span key={index} className="title-letter">{letter}</span>
          ))}
        </div>

        <div ref={subtitleRef} className="sub-title">
          {"A Smart Paradise".split('').map((letter, index) => (
            <span key={index} className="subtitle-letter">
              {letter === ' ' ? '\u00A0' : letter}
            </span>
          ))}
        </div>
      </div>
    </>
  );
};

export default AnimatedTagline;