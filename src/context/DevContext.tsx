import React, {
  createContext,
  useCallback,
  useContext,
  useState,
} from "react";

export type BlockData = {
  dx?: number;
  dy?: number;
  w?: number;
  h?: number;
  fontSize?: number;
};

type Store = Record<string, BlockData>;

interface DevCtx {
  devMode: boolean;
  toggleDev: () => void;
  getBlock: (id: string) => BlockData;
  setBlock: (id: string, data: BlockData) => void;
  clearAll: () => void;
}

const STORAGE_KEY = "pjotr-portfolio-layout-v1";

export const DevContext = createContext<DevCtx>({} as DevCtx);

export const DevProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [devMode, setDevMode] = useState(false);
  const [store, setStore] = useState<Store>(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    } catch {
      return {};
    }
  });

  const toggleDev = useCallback(() => setDevMode((v) => !v), []);

  const getBlock = useCallback(
    (id: string): BlockData => store[id] ?? {},
    [store],
  );

  const setBlock = useCallback((id: string, data: BlockData) => {
    setStore((prev) => {
      const next = { ...prev, [id]: data };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const clearAll = useCallback(() => {
    setStore({});
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return (
    <DevContext.Provider
      value={{ devMode, toggleDev, getBlock, setBlock, clearAll }}
    >
      {children}
    </DevContext.Provider>
  );
};

export const useDevMode = () => useContext(DevContext);
