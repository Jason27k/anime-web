interface LogoProps {
  className?: string;
}

const Logo = ({ className = "w-10 h-10" }: LogoProps) => (
  <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect width="32" height="32" rx="7" fill="#101418"/>
    <rect x="9.5" y="12" width="3" height="17" fill="#ffb778"/>
    <rect x="19.5" y="12" width="3" height="17" fill="#ffb778"/>
    <path d="M4 9 C5 10.5 7 11 9.5 11 L22.5 11 C25 11 27 10.5 28 9 L28 10.5 C27 12 25 12.5 22.5 12.5 L9.5 12.5 C7 12.5 5 12 4 10.5 Z" fill="#ffb778"/>
    <rect x="8" y="17" width="16" height="2.5" fill="#ffb778"/>
  </svg>
);

export default Logo;
