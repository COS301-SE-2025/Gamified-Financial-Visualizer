// daemon/schedulers/index.ts
import { scheduleGoalChecks } from "./goal.schedulars";

export async function initSchedulers() {
  console.log("[Daemon] initSchedulers(): mock init");
  scheduleGoalChecks();
}
