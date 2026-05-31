import { createContext, useContext, useState, ReactNode } from "react";
import { JOBS_SEED, APPLICANTS_SEED, type Job, type Applicant } from "@/data/jobs";

interface HiringContextValue {
  jobs: Job[];
  setJobs: React.Dispatch<React.SetStateAction<Job[]>>;
  applicants: Applicant[];
  setApplicants: React.Dispatch<React.SetStateAction<Applicant[]>>;
}

const HiringContext = createContext<HiringContextValue | null>(null);

export function HiringProvider({ children }: { children: ReactNode }) {
  const [jobs, setJobs] = useState<Job[]>(JOBS_SEED);
  const [applicants, setApplicants] = useState<Applicant[]>(APPLICANTS_SEED);
  return (
    <HiringContext.Provider value={{ jobs, setJobs, applicants, setApplicants }}>
      {children}
    </HiringContext.Provider>
  );
}

export function useHiring() {
  const ctx = useContext(HiringContext);
  if (!ctx) throw new Error("useHiring must be used inside HiringProvider");
  return ctx;
}
