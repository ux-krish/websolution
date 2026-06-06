import React from "react";
import styled from "styled-components";

const StyledBackgroundAnimation = styled.svg`
  position: absolute;
  inset: 0;
  bottom:0;
  left:0;
  z-index: -10;
  overflow: hidden;
  filter: blur(3rem);
  & rect {
    will-change: transform, opacity, filter;
  }
`;

const BackgroundAnimation = ({ className }) => {
  return (
    <StyledBackgroundAnimation
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      shapeRendering="geometricPrecision"
      colorRendering="optimizeQuality"
      textRendering="optimizeLegibility"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        {/* Gradient Definitions */}
        <radialGradient id="Gradient1" cx="50%" cy="50%" fx="10%" fy="10%" r="0.5">
          <animate attributeName="fx" dur="34s" values="10%;30%;10%" repeatCount="indefinite" />
          <stop offset="0%" stopColor="rgba(255, 0, 255, 1)" />
          <stop offset="100%" stopColor="rgba(255, 0, 255, 0)" />
        </radialGradient>
        <radialGradient id="Gradient2" cx="50%" cy="50%" fx="20%" fy="20%" r="0.5">
          <animate attributeName="fx" dur="23.5s" values="20%;40%;20%" repeatCount="indefinite" />
          <stop offset="0%" stopColor="rgba(255, 255, 0, 1)" />
          <stop offset="100%" stopColor="rgba(255, 255, 0, 0)" />
        </radialGradient>
        <radialGradient id="Gradient3" cx="50%" cy="50%" fx="15%" fy="15%" r="0.5">
          <animate attributeName="fx" dur="21.5s" values="15%;35%;15%" repeatCount="indefinite" />
          <stop offset="0%" stopColor="rgba(0, 255, 255, 1)" />
          <stop offset="100%" stopColor="rgba(0, 255, 255, 0)" />
        </radialGradient>
      </defs>

      {/* Gradient Background Layers */}
      <rect x="0" y="0" width="100%" height="100%" fill="url(#Gradient1)">
        <animate attributeName="x" dur="20s" values="25%;0%;25%" repeatCount="indefinite" />
        <animate attributeName="y" dur="21s" values="0%;25%;0%" repeatCount="indefinite" />
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="0 50 50"
          to="360 50 50"
          dur="17s"
          repeatCount="indefinite"
        />
      </rect>
      <rect x="0" y="0" width="100%" height="100%" fill="url(#Gradient2)">
        <animate attributeName="x" dur="23s" values="0%;-25%;0%" repeatCount="indefinite" />
        <animate attributeName="y" dur="24s" values="25%;-25%;25%" repeatCount="indefinite" />
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="0 50 50"
          to="360 50 50"
          dur="18s"
          repeatCount="indefinite"
        />
      </rect>
      <rect x="0" y="0" width="100%" height="100%" fill="url(#Gradient3)">
        <animate attributeName="x" dur="25s" values="-25%;0%;-25%" repeatCount="indefinite" />
        <animate attributeName="y" dur="26s" values="0%;-25%;0%" repeatCount="indefinite" />
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="360 50 50"
          to="0 50 50"
          dur="19s"
          repeatCount="indefinite"
        />
      </rect>
    </StyledBackgroundAnimation>
  );
};

export default BackgroundAnimation;
