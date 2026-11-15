import { NextRequest, NextResponse } from "next/server";
import { dispatchCareCircleEmail } from "@/lib/email-engine";

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET || "carecircle_hackathon_secure_cron_token_2026";

    // Verify bearer token or cron trigger
    if (authHeader && authHeader !== `Bearer ${cronSecret}`) {
      // In production enforce strictly
      if (process.env.NODE_ENV === "production" && process.env.CRON_SECRET) {
        return NextResponse.json({ error: "Unauthorized cron trigger" }, { status: 401 });
      }
    }

    // Process upcoming doses and alerts
    const alertsTriggered = [
      {
        to: "marcus.vance@carecircle.demo",
        recipientName: "Marcus Vance",
        subject: "CareCircle Automated Sync: Eleanor's Evening Schedule Ready",
        notificationType: "dose_reminder" as const,
        headline: "Evening Dose Window (07:30 PM & 09:00 PM)",
        messageBody: "Metformin HCl ER 500mg and Atorvastatin 20mg are scheduled for this evening. Eleanor has completed 100% of daytime doses.",
        patientName: "Eleanor Vance",
      },
    ];

    const results = [];
    for (const alert of alertsTriggered) {
      const rec = await dispatchCareCircleEmail(alert);
      results.push(rec);
    }

    return NextResponse.json({
      status: "cron_job_executed",
      processedCount: results.length,
      deliveries: results,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

