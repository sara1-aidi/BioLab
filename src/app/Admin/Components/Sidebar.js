'use client';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  HomeIcon,
  CalendarIcon,
  UserGroupIcon,
  InboxIcon,
  QuestionMarkCircleIcon,
  BellIcon,
  Bars3Icon, 
  XMarkIcon,
  ArrowUpCircleIcon
} from "@heroicons/react/24/outline";
import { useState } from "react";

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Active state checks with original spelling
  const isDashboardActive = pathname === "/Admin/dashboard";
  const isSendScanActive = pathname === "/Admin/send-scan";
  const isAppointmentsActive = pathname === "/Admin/appointements"; // Original spelling kept
  const isUsersActive = pathname === "/Admin/users";
  const isFAQActive = pathname === "/Admin/faq";
  const isMedicalActive = pathname === "/Admin/medical";
  const isContactActive = pathname === "/Admin/contact";
  const isNotificationsActive = pathname === "/Admin/notifications";

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white shadow-lg hover:bg-gray-50 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle navigation menu"
      >
        {isOpen ? (
          <XMarkIcon className="w-6 h-6 text-gray-700" />
        ) : (
          <Bars3Icon className="w-6 h-6 text-gray-700" />
        )}
      </button>

      {/* Sidebar Container */}
      <div
        className={`w-72 bg-white/95 backdrop-blur-sm h-screen fixed transition-transform duration-300 z-40 shadow-xl ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="p-6 h-full flex flex-col">
          {/* Branding Section */}
          <div className="mb-8 flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
              <HomeIcon className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800">Admin Dashboard</h2>
          </div>

          {/* Navigation Links */}
          <div className="flex-1 overflow-y-auto">
            <nav>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/Admin/dashboard"
                    className={`flex items-center gap-3 p-3 rounded-xl text-sm font-medium transition-colors ${
                      isDashboardActive ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-100"
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    <HomeIcon className="w-5 h-5" />
                    <span>Dashboard</span>
                  </Link>
                </li>

                <li>
                  <Link
                    href="/Admin/send-scan"
                    className={`flex items-center gap-3 p-3 rounded-xl text-sm font-medium transition-colors ${
                      isSendScanActive ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-100"
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    <ArrowUpCircleIcon className="w-5 h-5" />
                    <span>Send Scan</span>
                  </Link>
                </li>

                <li>
                  <Link
                    href="/Admin/appointements"  // Original spelling preserved
                    className={`flex items-center gap-3 p-3 rounded-xl text-sm font-medium transition-colors ${
                      isAppointmentsActive ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-100"
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    <CalendarIcon className="w-5 h-5" />
                    <span>Appointments</span>
                  </Link>
                </li>

                <li>
                  <Link
                    href="/Admin/users"
                    className={`flex items-center gap-3 p-3 rounded-xl text-sm font-medium transition-colors ${
                      isUsersActive ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-100"
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    <UserGroupIcon className="w-5 h-5" />
                    <span>User Management</span>
                  </Link>
                </li>

                <li>
                  <Link
                    href="/Admin/notifications"
                    className={`flex items-center gap-3 p-3 rounded-xl text-sm font-medium transition-colors ${
                      isNotificationsActive ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-100"
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    <BellIcon className="w-5 h-5" />
                    <span>Notifications</span>
                  </Link>
                </li>

                <li>
                  <Link
                    href="/Admin/faq"
                    className={`flex items-center gap-3 p-3 rounded-xl text-sm font-medium transition-colors ${
                      isFAQActive ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-100"
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    <QuestionMarkCircleIcon className="w-5 h-5" />
                    <span>FAQ Management</span>
                  </Link>
                </li>

                <li>
                  <Link
                    href="/Admin/medical"
                    className={`flex items-center gap-3 p-3 rounded-xl text-sm font-medium transition-colors ${
                      isMedicalActive ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-100"
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    <InboxIcon className="w-5 h-5" />
                    <span>Medical Assistance</span>
                  </Link>
                </li>

                <li>
                  <Link
                    href="/Admin/contact"
                    className={`flex items-center gap-3 p-3 rounded-xl text-sm font-medium transition-colors ${
                      isContactActive ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-100"
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    <InboxIcon className="w-5 h-5" />
                    <span>Contact Admin</span>
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-30"
          onClick={() => setIsOpen(false)}
          role="presentation"
        />
      )}
    </>
  );
}