import { createContext, useContext, useState, type ReactNode } from "react";
import { SALARY_DATA_SEED, type SalaryEntry } from "@/data/finance";

interface SalaryContextType {
  salaries: SalaryEntry[];
  setSalaries: React.Dispatch<React.SetStateAction<SalaryEntry[]>>;
  addSalaryEntry: (entry: Omit<SalaryEntry, "initials" | "color">) => void;
}

const SalaryContext = createContext<SalaryContextType | null>(null);

const COLORS = ["hsl(220,95%,47%)", "hsl(168,100%,42%)", "hsl(160,80%,40%)", "hsl(250,60%,60%)", "hsl(36,90%,53%)", "hsl(330,80%,60%)", "hsl(174,72%,46%)", "hsl(24,94%,53%)"];

export const SalaryProvider = ({ children }: { children: ReactNode }) => {
  const [salaries, setSalaries] = useState<SalaryEntry[]>(SALARY_DATA_SEED);

  function addSalaryEntry(entry: Omit<SalaryEntry, "initials" | "color">) {
    const initials = entry.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
    const color = COLORS[salaries.length % COLORS.length];
    setSalaries(prev => [...prev, { ...entry, initials, color }]);
  }

  return (
    <SalaryContext.Provider value={{ salaries, setSalaries, addSalaryEntry }}>
      {children}
    </SalaryContext.Provider>
  );
};

export const useSalaries = () => {
  const ctx = useContext(SalaryContext);
  if (!ctx) throw new Error("useSalaries must be used within SalaryProvider");
  return ctx;
};
