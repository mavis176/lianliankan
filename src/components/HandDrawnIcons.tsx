import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
}

// 1. Coffee Cup on Saucer (Exact match to image_1.png)
export const CoffeeCupIcon: React.FC<IconProps> = ({ size = 32, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Saucer */}
    <ellipse cx="24" cy="38" rx="18" ry="4.5" fill="#EADCCB" stroke="#66462C" strokeWidth="2.5" />
    <ellipse cx="24" cy="37" rx="14" ry="2.5" fill="#FAF6EE" />
    {/* Cup Body */}
    <path d="M12 16H36V28C36 34.6274 30.6274 37 24 37C17.3726 37 12 34.6274 12 28V16Z" fill="#FAF6EE" stroke="#66462C" strokeWidth="2.5" strokeLinejoin="round" />
    {/* Cup Inner & Coffee Surface */}
    <ellipse cx="24" cy="16" rx="12" ry="3.5" fill="#784724" stroke="#66462C" strokeWidth="2.5" />
    <ellipse cx="24" cy="16" rx="9" ry="2" fill="#583114" />
    <path d="M21 15C22.5 14.5 24.5 15.5 26 15" stroke="#E3C49F" strokeWidth="1.2" strokeLinecap="round" />
    {/* Handle */}
    <path d="M36 19C40.5 19 41.5 27 35.5 28.5" fill="none" stroke="#66462C" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

// 2. Strawberry Cake Slice
export const StrawberryCakeIcon: React.FC<IconProps> = ({ size = 32, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Cake Base */}
    <path d="M8 36L40 36L42 24L14 18L8 36Z" fill="#FCE7E6" stroke="#66462C" strokeWidth="2.5" strokeLinejoin="round" />
    {/* Cake Layer Stripes */}
    <path d="M9 30L41 30" stroke="#F4A5A5" strokeWidth="3" />
    <path d="M11 24L42 24" stroke="#FFFFFF" strokeWidth="2.5" />
    {/* Top Cream Frosting */}
    <path d="M14 18C16 16.5 19 16.5 21 18C23 16.5 26 16.5 28 18C30 16.5 33 16.5 35 18C37 16.5 40 16.5 42 18" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" />
    {/* Strawberry on Top */}
    <path d="M20 17C18 13 18 9 22 8C26 7 28 12 26 17C24 19 22 19 20 17Z" fill="#E64A4A" stroke="#66462C" strokeWidth="2" strokeLinejoin="round" />
    {/* Strawberry Seed dots & leaf */}
    <circle cx="22" cy="12" r="0.75" fill="#FFE58F" />
    <circle cx="24" cy="14" r="0.75" fill="#FFE58F" />
    <path d="M22 8C21 6 20 6 19 7M23 7.5C24 6 25 6 26 7" stroke="#48BB78" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

// 3. Golden Croissant
export const CroissantIcon: React.FC<IconProps> = ({ size = 32, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Curved body */}
    <path d="M10 32C8 28 8 20 14 15C20 10 28 10 34 15C40 20 40 28 38 32C36 34 32 35 30 31C28 27 20 27 18 31C16 35 12 34 10 32Z" fill="#E8963D" stroke="#66462C" strokeWidth="2.5" strokeLinejoin="round" />
    {/* Crust Segments */}
    <path d="M18 14C20 19 21 27 19 31" stroke="#C46E20" strokeWidth="2" strokeLinecap="round" />
    <path d="M24 12C25 18 25 26 24 30" stroke="#C46E20" strokeWidth="2.2" strokeLinecap="round" />
    <path d="M30 14C29 19 28 27 30 31" stroke="#C46E20" strokeWidth="2" strokeLinecap="round" />
    {/* Shine highlight */}
    <path d="M18 16C21 14 27 14 30 16" stroke="#FFD899" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

// 4. Chocolate Frosted Donut
export const DonutIcon: React.FC<IconProps> = ({ size = 32, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Donut Dough */}
    <ellipse cx="24" cy="24" rx="16" ry="15" fill="#E8B878" stroke="#66462C" strokeWidth="2.5" />
    {/* Chocolate Icing */}
    <path d="M11 22C11 15 17 11 24 11C31 11 37 15 37 22C37 25 35 27 33 25C31 23 29 27 27 25C25 23 23 27 21 25C19 23 17 27 15 25C13 23 11 25 11 22Z" fill="#704225" stroke="#66462C" strokeWidth="2" strokeLinejoin="round" />
    {/* Center Hole */}
    <ellipse cx="24" cy="24" rx="5.5" ry="5" fill="#FAF6EE" stroke="#66462C" strokeWidth="2.5" />
    {/* Sprinkles */}
    <path d="M18 16L20 17" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
    <path d="M28 15L30 16" stroke="#F6AD55" strokeWidth="2" strokeLinecap="round" />
    <path d="M33 21L34 23" stroke="#F687B3" strokeWidth="2" strokeLinecap="round" />
    <path d="M14 21L15 23" stroke="#68D391" strokeWidth="2" strokeLinecap="round" />
    <path d="M24 14L25 15" stroke="#F6E05E" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

// 5. Cat Paw Biscuit
export const CatPawIcon: React.FC<IconProps> = ({ size = 32, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Biscuit Outline */}
    <rect x="8" y="8" width="32" height="32" rx="10" fill="#E5BD92" stroke="#66462C" strokeWidth="2.5" />
    {/* Main Paw Pad */}
    <ellipse cx="24" cy="28" rx="8" ry="6" fill="#845330" stroke="#66462C" strokeWidth="1.5" />
    {/* 4 Little Toe Pads */}
    <circle cx="16" cy="18" r="3" fill="#845330" stroke="#66462C" strokeWidth="1.2" />
    <circle cx="21.5" cy="15" r="3.2" fill="#845330" stroke="#66462C" strokeWidth="1.2" />
    <circle cx="26.5" cy="15" r="3.2" fill="#845330" stroke="#66462C" strokeWidth="1.2" />
    <circle cx="32" cy="18" r="3" fill="#845330" stroke="#66462C" strokeWidth="1.2" />
  </svg>
);

// 6. Milk Bottle
export const MilkBottleIcon: React.FC<IconProps> = ({ size = 32, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Bottle Body */}
    <rect x="15" y="16" width="18" height="23" rx="4" fill="#FFFFFF" stroke="#66462C" strokeWidth="2.5" />
    {/* Neck */}
    <rect x="19" y="11" width="10" height="6" fill="#FFFFFF" stroke="#66462C" strokeWidth="2" />
    {/* Blue Cap */}
    <rect x="18" y="8" width="12" height="4" rx="2" fill="#63B3ED" stroke="#66462C" strokeWidth="2" />
    {/* Milk Level / Wave */}
    <path d="M16 23C19 22 22 24 25 23C28 22 31 24 32 23V37C32 38 31 38 30 38H18C17 38 16 38 16 37V23Z" fill="#EDF2F7" />
    {/* Glass Reflection */}
    <path d="M18 20V34" stroke="#CBD5E0" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

// 7. Matcha Green Tea
export const MatchaTeaIcon: React.FC<IconProps> = ({ size = 32, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Wooden Coaster */}
    <ellipse cx="24" cy="38" rx="16" ry="3.5" fill="#C08457" stroke="#66462C" strokeWidth="2" />
    {/* Bowl Body */}
    <path d="M13 18H35V28C35 34 30 36 24 36C18 36 13 34 13 28V18Z" fill="#FAF6EE" stroke="#66462C" strokeWidth="2.5" strokeLinejoin="round" />
    {/* Matcha liquid surface */}
    <ellipse cx="24" cy="18" rx="11" ry="3" fill="#689F38" stroke="#66462C" strokeWidth="2" />
    <ellipse cx="24" cy="18" rx="8" ry="1.8" fill="#7CB342" />
    {/* Green Leaf Deco on Cup */}
    <path d="M22 26C22 24 26 24 26 26C26 28 22 28 22 26Z" fill="#7CB342" />
    <path d="M22 28C21 27 20 28 20 29" stroke="#558B2F" strokeWidth="1" />
  </svg>
);

// 8. Pink Bow-Wrapped Candy
export const PinkCandyIcon: React.FC<IconProps> = ({ size = 32, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Left Wrapper Twist */}
    <path d="M17 24L7 17V31L17 24Z" fill="#FBB6CE" stroke="#66462C" strokeWidth="2" strokeLinejoin="round" />
    {/* Right Wrapper Twist */}
    <path d="M31 24L41 17V31L31 24Z" fill="#FBB6CE" stroke="#66462C" strokeWidth="2" strokeLinejoin="round" />
    {/* Center Round Candy */}
    <circle cx="24" cy="24" r="9" fill="#F687B3" stroke="#66462C" strokeWidth="2.5" />
    {/* Heart on candy */}
    <path d="M24 22C23 20 21 20 20 21C19 22.5 21 24.5 24 26C27 24.5 29 22.5 28 21C27 20 25 20 24 22Z" fill="#FFFFFF" />
  </svg>
);

// 9. Green Tea Powder / Jam Jar
export const GreenJarIcon: React.FC<IconProps> = ({ size = 32, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Jar Lid */}
    <rect x="18" y="9" width="12" height="5" rx="2" fill="#E2E8F0" stroke="#66462C" strokeWidth="2" />
    {/* Jar Body */}
    <rect x="14" y="14" width="20" height="24" rx="6" fill="#84A98C" stroke="#66462C" strokeWidth="2.5" />
    {/* White Label */}
    <rect x="17" y="21" width="14" height="11" rx="2" fill="#FAF6EE" stroke="#66462C" strokeWidth="1.5" />
    <ellipse cx="24" cy="26" rx="3.5" ry="2" fill="#52796F" />
  </svg>
);

// 10. Strawberry Jam Jar
export const JamJarIcon: React.FC<IconProps> = ({ size = 32, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Jar Lid */}
    <rect x="18" y="9" width="12" height="5" rx="2" fill="#CBD5E0" stroke="#66462C" strokeWidth="2" />
    {/* Jar Body */}
    <rect x="14" y="14" width="20" height="24" rx="6" fill="#E57373" stroke="#66462C" strokeWidth="2.5" />
    {/* Label with strawberry mark */}
    <rect x="17" y="21" width="14" height="11" rx="2" fill="#FAF6EE" stroke="#66462C" strokeWidth="1.5" />
    <path d="M24 28C22 25 22 23 24 23C26 23 26 25 24 28Z" fill="#C62828" />
  </svg>
);

// Map type to Icon Component
export const ICON_COMPONENTS = [
  CoffeeCupIcon,       // 1
  StrawberryCakeIcon,  // 2
  CroissantIcon,       // 3
  DonutIcon,           // 4
  CatPawIcon,          // 5
  MilkBottleIcon,      // 6
  MatchaTeaIcon,       // 7
  PinkCandyIcon,       // 8
  GreenJarIcon,        // 9
  JamJarIcon,          // 10
];
