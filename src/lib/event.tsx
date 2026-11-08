import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";


export type PublicEvent = {
  settings: {
    event_name: string;
    event_date: string;
    venue: string;
    time?: string;
    formUrl?: string;
    capacity: number;
    allowed_email_domain: string;
    rules: string[];
    privacy_contact?: string;
    retention_notice?: string;
  };
  confirmed: number;
  available: number;
  registrationOpen: boolean;
};

const EventContext = createContext<PublicEvent | null>(null);
export const useEventConfig = () => useContext(EventContext);

export function EventProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<PublicEvent | null>(null);
  useEffect(() => {

    let active = true;
    const refresh = async () => {
      try {
        const response = await fetch("/api/event");
        if (!response.ok) throw Error();
        const settings = await response.json();
        const value = {settings,confirmed:0,available:0,registrationOpen:Boolean(settings.formUrl)};
        if (active) setConfig(value);
      } catch {
        if (active) setConfig(null);
      }
    };
    void refresh();
    window.addEventListener("event-updated",refresh);
    const timer = window.setInterval(refresh, 60_000);
    return () => {
      window.removeEventListener("event-updated",refresh);
      active = false;
      window.clearInterval(timer);
    };
  }, []);
  return (
    <EventContext.Provider value={config}>{children}</EventContext.Provider>
  );
}

export function eventDateParts(config: PublicEvent | null) {
  const iso = config?.settings.event_date || "2026-11-12";
  const date = new Date(`${iso.slice(0, 10)}T12:00:00Z`);
  const format = (options: Intl.DateTimeFormatOptions) =>
    new Intl.DateTimeFormat("en-GB", { ...options, timeZone: "UTC" })
      .format(date)
      .toUpperCase();
  return {
    dayMonth: format({ day: "2-digit", month: "short" }),
    weekday: format({ weekday: "long" }),
    year: format({ year: "numeric" }),
    full: format({ day: "2-digit", month: "short", year: "numeric" }),
    numeric: format({
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).replaceAll("/", "."),
  };
}
