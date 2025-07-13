"use client";

import {
  CircleArrowUp,
  GraduationCap,
  Home,
  LucideProps,
  Menu,
  MessageCircleMore,
  Search,
  Settings,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { forwardRef, useEffect, useState } from "react";
import { createClient } from "../../utils/supabase/client";
import { NavItem } from "./NavItem";



// === ICON COMPONENTS ===

const NetworkIcon = forwardRef<SVGSVGElement, LucideProps>((props, ref) => (
  <svg
    ref={ref}
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M12 7.2C13.58 7.2 14.86 5.92 14.86 4.34C14.86 2.76 13.58 1.48 12 1.48C10.42 1.48 9.14 2.76 9.14 4.34C9.14 5.92 10.42 7.2 12 7.2Z"
      strokeWidth="2"
    />
    <path
      d="M19.64 19.61C21.22 19.61 22.5 18.33 22.5 16.75C22.5 15.17 21.22 13.89 19.64 13.89C18.06 13.89 16.78 15.17 16.78 16.75C16.78 18.33 18.06 19.61 19.64 19.61Z"
      strokeWidth="2"
    />
    <path
      d="M4.36 19.61C5.94 19.61 7.22 18.33 7.22 16.75C7.22 15.17 5.94 13.89 4.36 13.89C2.78 13.89 1.5 15.17 1.5 16.75C1.5 18.33 2.78 19.61 4.36 19.61Z"
      strokeWidth="2"
    />
    <path
      d="M6 19.09C7.6 20.66 9.76 21.53 12 21.53C14.24 21.53 16.4 20.66 18 19.09"
      strokeWidth="2"
    />
    <path
      d="M14.82 4.82C16.51 5.4 17.97 6.5 19 7.95C20.04 9.41 20.59 11.15 20.59 12.93C20.59 13.3 20.56 13.67 20.51 14.03"
      strokeWidth="2"
    />
    <path
      d="M3.49 14C3.43 13.64 3.41 13.27 3.41 12.9C3.41 11.12 3.97 9.39 5.01 7.94C6.04 6.49 7.5 5.4 9.18 4.82"
      strokeWidth="2"
    />
  </svg>
));
NetworkIcon.displayName = "NetworkIcon";

const ScholarshipDatabaseIcon = forwardRef<SVGSVGElement, LucideProps>(
  (props, ref) => (
    <svg
      ref={ref}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M12 12.98L12.6 14.24L13.95 14.44L12.98 15.42L13.21 16.8L12 16.15L10.79 16.8L11.02 15.42L10.05 14.44L11.4 14.24L12 12.98Z"
        strokeWidth="2"
      />
      <path
        d="M8.17 10.11C9.35 9.49 10.66 9.15 12 9.11C13.34 9.15 14.65 9.49 15.83 10.11"
        strokeWidth="2"
      />
      <path d="M18.69 5.33H5.3V20.63H18.69V5.33Z" strokeWidth="2" />
      <path d="M3.39 5.33H20.61" strokeWidth="2" />
      <path d="M13.91 23.5V20.63" strokeWidth="2" />
      <path d="M17.74 23.5V20.63" strokeWidth="2" />
      <path d="M10.09 23.5V20.63" strokeWidth="2" />
      <path d="M6.26 23.5V20.63" strokeWidth="2" />
      <path d="M17.74 5.33H6.26L12 1.5L17.74 5.33Z" strokeWidth="2" />
    </svg>
  )
);
ScholarshipDatabaseIcon.displayName = "ScholarshipDatabaseIcon";

const TestPrepIcon = forwardRef<SVGSVGElement, LucideProps>((props, ref) => (
  <svg
    ref={ref}
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M22.5 8.18V20.59C22.5 21.1 22.29 21.58 21.94 21.94C21.58 22.3 21.1 22.5 20.59 22.5C20.09 22.5 19.6 22.29 19.24 21.93C18.89 21.58 18.68 21.09 18.68 20.59V8.18H22.5Z"
      strokeWidth="2"
    />
    <path
      d="M20.59 22.5H3.41C3.16 22.5 2.91 22.45 2.68 22.36C2.45 22.26 2.23 22.12 2.06 21.94C1.88 21.77 1.74 21.55 1.64 21.32C1.54 21.09 1.5 20.84 1.5 20.59V1.5H18.68V20.59C18.68 21.09 18.89 21.58 19.24 21.93C19.6 22.29 20.09 22.5 20.59 22.5Z"
      strokeWidth="2"
    />
    <path d="M14.87 5.32H5.32V11.05H14.87V5.32Z" strokeWidth="2" />
    <path d="M4.36 14.86H15.82" strokeWidth="2" />
    <path d="M4.36 18.68H15.82" strokeWidth="2" />
  </svg>
));
TestPrepIcon.displayName = "TestPrepIcon";

const ResearchHub = forwardRef<SVGSVGElement, LucideProps>((props, ref) => (
  <svg
    ref={ref}
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M21.54 1.5H6.27V18.68H21.54V1.5Z" strokeWidth="2" />
    <path d="M17.73 18.68V22.5H2.46V5.32H6.27" strokeWidth="2" />
    <path d="M9.14 6.27H18.68" strokeWidth="2" />
    <path d="M9.14 10.09H18.68" strokeWidth="2" />
    <path d="M9.14 13.91H14.86" strokeWidth="2" />
  </svg>
));
ResearchHub.displayName = "ResearchHub";

const CalendarTrackerIcon = forwardRef<SVGSVGElement, LucideProps>(
  (props, ref) => (
    <svg
      ref={ref}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M22.52 3.37H1.48V8.15H22.52V3.37Z" strokeWidth="2" />
      <path d="M22.52 8.15H1.48V22.5H22.52V8.15Z" strokeWidth="2" />
      <path
        d="M5.3 12.93H7.22M9.13 12.93H11.04M12.96 12.93H14.87M16.78 12.93H18.7M16.78 17.72H18.7M5.3 17.72H7.22M9.13 17.72H11.04M12.96 17.72H14.87"
        strokeWidth="2"
      />
      <path d="M6.26 0.5V5.28M12 0.5V5.28M17.74 0.5V5.28" strokeWidth="2" />
    </svg>
  )
);
CalendarTrackerIcon.displayName = "CalendarTrackerIcon";

const LogOutIcon = forwardRef<SVGSVGElement, LucideProps>((props, ref) => (
  <svg
    ref={ref}
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="white"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M9.61 10.1C11.98 10.1 13.91 8.17 13.91 5.8C13.91 3.43 11.98 1.5 9.61 1.5C7.24 1.5 5.31 3.43 5.31 5.8C5.31 8.17 7.24 10.1 9.61 10.1Z"
      strokeWidth="2"
    />
    <path
      d="M1.5 19.64L2.2 16.17C2.54 14.46 3.47 12.91 4.82 11.81C6.17 10.7 7.86 10.09 9.61 10.09C11.27 10.09 12.89 10.64 14.2 11.66"
      strokeWidth="2"
    />
    <path
      d="M16.77 22.5C19.93 22.5 22.5 19.93 22.5 16.77C22.5 13.61 19.93 11.04 16.77 11.04C13.61 11.04 11.04 13.61 11.04 16.77C11.04 19.93 13.61 22.5 16.77 22.5Z"
      strokeWidth="2"
    />
    <path d="M13.91 16.77H19.64" strokeWidth="2" />
  </svg>
));
LogOutIcon.displayName = "LogOutIcon";

// === SIDEBAR COMPONENT ===

export const SideBar = () => {
  const supabase = createClient(); 
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  
  // Close sidebar when screen gets larger than md breakpoint
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);


async function handleLogout() {
  const { error } = await supabase.auth.signOut()

  if (error) {
    console.error('Logout error:', error.message)
  } else {
    // Redirect to landing page using Next.js router
    router.push('/landingPage')
  }
}

  
  return (
    <>
      {/* Mobile menu button */}
      <button 
        className="md:hidden fixed top-4 left-4 z-[100] p-2 rounded-md bg-teal-700 text-white shadow-lg"
        onClick={() => setIsOpen(!isOpen)}
        style={{ top: "1rem", left: "0.5rem" }}
        aria-label="Toggle menu"
      >
        <Menu size={24} />
      </button>
      
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      <div
        className={`fixed md:sticky md:top-0 md:translate-x-0 inset-y-0 left-0 z-40 flex flex-col h-screen max-h-screen w-72 md:w-64 text-white transform transition-all duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
        style={{ backgroundColor: "#20606B" }}
      >   
        <div className="flex items-center justify-between h-16 border-b border-teal-600 px-4">
          <h1 className="text-xl font-semibold">Your SlateSpace</h1>
          <button 
            className="md:hidden p-2 rounded-md hover:bg-teal-600 text-white"
            onClick={() => setIsOpen(false)}
          >
            ✕
          </button>
        </div>
        
      <nav className="flex-1 p-4 overflow-y-auto">
        <div>
          <NavItem icon={Home} label="Dashboard" href="/dashboard" />
          <NavItem icon={User} label="Profile" href="#" />
          <NavItem icon={Search} label="Search" href="#" />
        </div>

        <div className="pt-6">
          <h3 className="text-sm font-medium text-teal-100 mb-3">
            High School
          </h3>
          <div className="space-y-1">
            <NavItem icon={GraduationCap} label="Roadmap Builder" href="/roadmap-builder" />
            <NavItem
              icon={NetworkIcon}
              label="Extracurricular Database"
              href="/ec-db"
            />
            <NavItem icon={CircleArrowUp} label="Application Hub" href="/application-hub" />
            <NavItem
              icon={ScholarshipDatabaseIcon}
              label="Scholarship Database"
              href="/scholarship-db"
            />
            <NavItem icon={TestPrepIcon} label="Test Prep" href="/test-prep" />
            <NavItem icon={ResearchHub} label="Research Hub" href="#" />
            <NavItem
              icon={CalendarTrackerIcon}
              label="Calendar Tracker"
              href="#"
            />
            <NavItem icon={MessageCircleMore} label="Community" href="#" />
          </div>
        </div>
      </nav>

      <div className="p-4 border-t border-teal-600">
        <NavItem icon={Settings} label="Settings" href="#" />
        <NavItem onClick = {handleLogout} icon={LogOutIcon} label="Log Out" href="/landingPage" />
      </div>
    </div>
    </>
  );
};
export default SideBar;