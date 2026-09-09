import Notification from '@/src/components/userDashboard/Notification'
import React from 'react'
import NotificationView from "@/src/components/userDashboard/NotificationView";
import React from "react";

export default function page() {
  return (
    <div>
    <Notification></Notification>
      <NotificationView />
    </div>
  )
  );
}
