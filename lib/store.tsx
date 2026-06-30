'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { mockIssues, mockUsers, currentUser, Issue, User } from './mockData';

interface Notification {
  id: string;
  type: 'verified' | 'assigned' | 'resolved' | 'nearby' | 'comment';
  title: string;
  message: string;
  time: string;
  read: boolean;
  issueId?: string;
}

interface AppContextType {
  user: User;
  issues: Issue[];
  notifications: Notification[];
  darkMode: boolean;
  toggleDarkMode: () => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  addIssue: (issue: Issue) => void;
  unreadCount: number;
}

const AppContext = createContext<AppContextType | null>(null);

const defaultNotifications: Notification[] = [
  { id: 'n1', type: 'verified', title: 'Issue Verified!', message: 'Your report "Pothole on MG Road" has been verified by 47 citizens.', time: '2 hours ago', read: false, issueId: 'ISS-001' },
  { id: 'n2', type: 'assigned', title: 'Issue Assigned', message: 'Your report has been assigned to Road Maintenance Department.', time: '5 hours ago', read: false, issueId: 'ISS-001' },
  { id: 'n3', type: 'resolved', title: '🎉 Issue Resolved!', message: 'Water pipeline burst at Dadar has been successfully repaired.', time: '1 day ago', read: false, issueId: 'ISS-004' },
  { id: 'n4', type: 'nearby', title: 'New Issue Nearby', message: 'A new pothole has been reported 500m from your location.', time: '2 days ago', read: true },
  { id: 'n5', type: 'comment', title: 'New Comment', message: 'Priya K commented on your report: "My scooter got damaged here..."', time: '3 days ago', read: true, issueId: 'ISS-001' },
];

export function AppProvider({ children }: { children: ReactNode }) {
  const [issues, setIssues] = useState<Issue[]>(mockIssues);
  const [notifications, setNotifications] = useState<Notification[]>(defaultNotifications);
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('civicai-dark-mode');
    if (stored !== null) setDarkMode(JSON.parse(stored));
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('civicai-dark-mode', JSON.stringify(darkMode));
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(prev => !prev);

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const addIssue = (issue: Issue) => {
    setIssues(prev => [issue, ...prev]);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <AppContext.Provider value={{
      user: currentUser,
      issues,
      notifications,
      darkMode,
      toggleDarkMode,
      markNotificationRead,
      markAllNotificationsRead,
      addIssue,
      unreadCount,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
