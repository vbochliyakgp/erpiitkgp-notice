import React, { createContext, useContext, useState, useEffect } from "react";
import client from "../api/client";

export interface Notice {
  notification_number: number;
  type: string;
  subject: string;
  company: string;
  title: string;
  description: string;
  date_generated: string;
}

interface NoticeContextProps {
  notices: Notice[];
  loading: boolean;
  error: string | null;
  fetchNotices: (params?: Record<string, any>) => void;
}

const NoticeContext = createContext<NoticeContextProps | undefined>(undefined);

export const NoticeProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNotices = async (
    params: Record<string, any> = { page: 1, limit: 10 }
  ) => {
    setLoading(true);
    try {
      const res = await client.get("/api/notices", { params });
      setNotices(res.data.data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  return (
    <NoticeContext.Provider value={{ notices, loading, error, fetchNotices }}>
      {children}
    </NoticeContext.Provider>
  );
};

export const useNotices = (): NoticeContextProps => {
  const ctx = useContext(NoticeContext);
  if (!ctx) throw new Error("useNotices must be used within NoticeProvider");
  return ctx;
};
