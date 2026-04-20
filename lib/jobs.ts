import fs from "fs";
import path from "path";
import { ProjectJob } from "./types";

const JOBS_DIR = process.env.JOBS_DIR || path.join(process.cwd(), "data", "jobs");

function ensureDir() {
  if (!fs.existsSync(JOBS_DIR)) fs.mkdirSync(JOBS_DIR, { recursive: true });
}

export function saveJob(job: ProjectJob): void {
  ensureDir();
  fs.writeFileSync(path.join(JOBS_DIR, `${job.id}.json`), JSON.stringify(job, null, 2));
}

export function getJob(id: string): ProjectJob | null {
  const p = path.join(JOBS_DIR, `${id}.json`);
  if (!fs.existsSync(p)) return null;
  try { return JSON.parse(fs.readFileSync(p, "utf-8")); } catch { return null; }
}
