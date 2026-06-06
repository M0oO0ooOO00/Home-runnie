'use client';

import { useCallback, useMemo, useState } from 'react';

export interface ChatProfileTarget {
  nickname: string;
  supportTeam: string | null;
}

export function useChatRoomOverlays() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [profileTarget, setProfileTarget] = useState<ChatProfileTarget | null>(null);

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen((prev) => !prev);
  }, []);

  const closeSidebar = useCallback(() => {
    setIsSidebarOpen(false);
  }, []);

  const openReport = useCallback(() => {
    setIsReportOpen(true);
  }, []);

  const closeReport = useCallback(() => {
    setIsReportOpen(false);
  }, []);

  const openProfile = useCallback((target: ChatProfileTarget) => {
    setProfileTarget(target);
  }, []);

  const closeProfile = useCallback(() => {
    setProfileTarget(null);
  }, []);

  return useMemo(
    () => ({
      sidebar: {
        isOpen: isSidebarOpen,
        toggle: toggleSidebar,
        close: closeSidebar,
      },
      report: {
        isOpen: isReportOpen,
        open: openReport,
        close: closeReport,
      },
      profile: {
        isOpen: !!profileTarget,
        target: profileTarget,
        open: openProfile,
        close: closeProfile,
      },
    }),
    [
      closeProfile,
      closeReport,
      closeSidebar,
      isReportOpen,
      isSidebarOpen,
      openProfile,
      openReport,
      profileTarget,
      toggleSidebar,
    ],
  );
}
