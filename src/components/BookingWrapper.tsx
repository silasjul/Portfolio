"use client";

import { getCalApi } from "@calcom/embed-react";
import { useEffect } from "react";
import posthog from 'posthog-js'

export default function BookingWrapper({ children, theme = "dark" }: { children: React.ReactNode, theme?: "dark" | "light" }) {
  useEffect(() => {
    (async function () {
      const cal = await getCalApi({ "namespace": "discovery-call", "embedJsUrl": "https://app.cal.eu/embed/embed.js" });
      cal("ui", { "theme": theme, "hideEventTypeDetails": false, "layout": "month_view" });
      posthog.capture('cal_booking_widget_loaded')
    })();
  }, [theme])
  return <div className="w-fit" data-cal-namespace="discovery-call"
    data-cal-link="silaskierstein/discovery-call"
    data-cal-origin="https://cal.eu"
    data-cal-config={`{"layout":"month_view","useSlotsViewOnSmallScreen":"true","theme":"${theme}"}`}
  >{children}</div>;
};
