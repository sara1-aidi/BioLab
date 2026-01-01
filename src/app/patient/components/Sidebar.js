'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  CalendarIcon, 
  BookOpenIcon, 
  Bars3Icon, 
  XMarkIcon,
  CpuChipIcon,
  UserIcon,
  CogIcon,
  QuestionMarkCircleIcon,
  ArrowUpCircleIcon,
  DocumentTextIcon,
  HeartIcon,
  CameraIcon
} from "@heroicons/react/24/outline";
import { useState } from "react";

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const isAppointmentsActive = pathname === "/patient/appointments";
  const isFAQActive = pathname === "/patient/faq";
  const isScansActive = pathname === "/patient/scans";
  const isAssistanceActive = pathname === "/patient/assistance";
  const isAIActive = pathname === "/patient/ai";

  return (
    <>
      {/* Mobile menu button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white shadow-lg hover:bg-gray-50 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        {isOpen ? (
          <XMarkIcon className="w-6 h-6 text-gray-700" />
        ) : (
          <Bars3Icon className="w-6 h-6 text-gray-700" />
        )}
      </button>

      {/* Sidebar/Drawer */}
      <div
        className={`w-72 bg-white/95 backdrop-blur-sm h-screen fixed transition-all duration-300 z-40 shadow-xl ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="p-6 h-full flex flex-col" style={{minHeight: '-webkit-fill-available'}}>
          {/* Logo/Branding */}
          <div className="mb-8 flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
              <UserIcon className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800">Patient Portal</h2>
          </div>

          {/* Scrollable Navigation */}
          <div className="flex-1 overflow-y-auto">
            <nav>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/patient/appointments"
                    className={`flex items-center gap-3 p-3 rounded-xl text-sm font-medium transition-colors ${
                      isAppointmentsActive
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    <CalendarIcon className="w-5 h-5" />
                    <span>Appointments</span>
                  </Link>
                </li>

                <li>
                  <Link
                    href="/patient/Scan"
                    className={`flex items-center gap-3 p-3 rounded-xl text-sm font-medium transition-colors ${
                      isScansActive
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    <CameraIcon className="w-5 h-5" />
                    <span>My Scans</span>
                  </Link>
                </li>
                
                <li>
                  <Link
                    href="/patient/medical-assistance"
                    className={`flex items-center gap-3 p-3 rounded-xl text-sm font-medium transition-colors ${
                      isAssistanceActive
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    <HeartIcon className="w-5 h-5" />
                    <span>Medical Assistance</span>
                  </Link>
                </li>
                
                <li>
                  <Link
                    href="/patient/AI"
                    className={`flex items-center gap-3 p-3 rounded-xl text-sm font-medium transition-colors ${
                      isAIActive
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    <CpuChipIcon className="w-5 h-5" />
                    <span>AI Scan Analysis</span>
                  </Link>
                </li>
                
                <li>
                  <Link
                    href="/patient/faq"
                    className={`flex items-center gap-3 p-3 rounded-xl text-sm font-medium transition-colors ${
                      isFAQActive
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    <BookOpenIcon className="w-5 h-5" />
                    <span>Knowledge Base</span>
                  </Link>
                </li>
              </ul>
            </nav>
          </div>

          {/* Fixed Bottom Section */}
          <div className="pt-4 border-t border-gray-200">
            <ul className="space-y-3">
              <li>
                <Link
                  href="/patient/Upgrade"
                  className="flex items-center gap-3 p-3 rounded-xl text-sm font-medium text-blue-600 hover:bg-blue-50 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <ArrowUpCircleIcon className="w-5 h-5" />
                  <span>Upgrade Plan</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/patient/contact-admin"
                  className="flex items-center gap-3 p-3 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <CogIcon className="w-5 h-5" />
                  <span>Settings</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/patient/help"
                  className="flex items-center gap-3 p-3 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <QuestionMarkCircleIcon className="w-5 h-5" />
                  <span>Help Center</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}