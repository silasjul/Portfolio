import { getCalApi } from "@calcom/embed-react";
import { useEffect } from "react";

export default function BookingWrapper({ children, theme = "dark" }: { children: React.ReactNode, theme?: "dark" | "light" }) {
  useEffect(() => {
    (async function () {
      const cal = await getCalApi({ "namespace": "discovery-call", "embedJsUrl": "https://app.cal.eu/embed/embed.js" });
      cal("ui", { "theme": theme, "hideEventTypeDetails": false, "layout": "month_view" });
    })();
  }, [theme])
  return <div data-cal-namespace="discovery-call"
    data-cal-link="silaskierstein/discovery-call"
    data-cal-origin="https://cal.eu"
    data-cal-config={`{"layout":"month_view","useSlotsViewOnSmallScreen":"true","theme":"${theme}"}`}
  >{children}</div>;
};
