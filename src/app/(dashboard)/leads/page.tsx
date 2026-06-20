import { mockAuditLogs, mockLeads } from "@/lib/api/mock-data";
import { LeadsClient } from "./LeadsClient";

export default function LeadsPage() {
  return <LeadsClient initialLeads={mockLeads} initialLogs={mockAuditLogs} />;
}
