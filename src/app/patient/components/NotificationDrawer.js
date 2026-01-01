"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Paper, List, ListItem, ListItemText, Typography } from "@mui/material";
import { BellIcon } from "@heroicons/react/24/outline";

const NotificationDrawer = () => {
  const [open, setOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const notifications = [
    { id: 1, message: "📅 Consultation reminder", link: "/patient/appointments", timestamp: "29 Mars 2025 - 10:30" },
    { id: 2, message: "📑 Scan results ready!", link: "/patient/Scan", timestamp: "29 Mars 2025 - 14:15" },
    { id: 4, message: "📢 Important health notice", link: "/patient/faq", timestamp: "30 Mars 2025 - 11:45" },
    { id: 5, message: "📝 Lab test report available", link: "/lab-results", timestamp: "30 Mars 2025 - 15:20" },
    { id: 6, message: "🔔 Follow-up consultation scheduled", link: "/follow-up", timestamp: "31 Mars 2025 - 08:00" },
  ];

  return (
    <div className="relative">
      {/* Notification button */}
      <button onClick={toggleDrawer} className="p-2 relative">
        <BellIcon className="h-6 w-6 text-gray-700" />
        {notifications.length > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {notifications.length}
          </span>
        )}
      </button>

      {/* Notification card that appears at top */}
      {open && (
        <Paper 
          elevation={4}
          className="absolute right-0 top-full mt-2 w-80 z-50 max-h-96 overflow-hidden"
          sx={{
            borderRadius: '16px',
            transformOrigin: 'top right',
            animation: 'scaleIn 0.2s ease-out',
            '@keyframes scaleIn': {
              '0%': { transform: 'scale(0.8)', opacity: 0 },
              '100%': { transform: 'scale(1)', opacity: 1 }
            }
          }}
        >
          <div className="p-4 flex flex-col">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-bold text-blue-500">
                Notifications
              </h2>
              <button 
                onClick={toggleDrawer}
                className="text-gray-500 hover:text-gray-700 text-lg"
              >
                ✕
              </button>
            </div>

            {/* Notification list with scroll */}
            <div className="overflow-y-auto max-h-72">
              <List dense>
                {notifications.map((notif) => (
                  <ListItem 
                    key={notif.id} 
                    onMouseEnter={() => setHoveredItem(notif.id)}
                    onMouseLeave={() => setHoveredItem(null)}
                    sx={{
                      cursor: "pointer",
                      borderRadius: "8px",
                      transition: "background-color 0.2s ease-in-out",
                      backgroundColor: hoveredItem === notif.id ? "rgba(0, 0, 0, 0.04)" : "transparent",
                      padding: "8px 12px",
                      marginBottom: "4px",
                    }}
                  >
                    <div onClick={toggleDrawer} className="w-full">
                      <Link href={notif.link} className="w-full">
                        <ListItemText 
                          primary={
                            <Typography variant="body1" component="div">
                              {notif.message}
                            </Typography>
                          } 
                          secondary={
                            <Typography variant="caption" color="textSecondary">
                              {notif.timestamp}
                            </Typography>
                          } 
                          sx={{
                            '& .MuiListItemText-primary': {
                              fontWeight: 500,
                            }
                          }}
                        />
                      </Link>
                    </div>
                  </ListItem>
                ))}
              </List>
            </div>
          </div>
        </Paper>
      )}
    </div>
  );
};

export default NotificationDrawer;