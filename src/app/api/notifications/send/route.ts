import { NextRequest, NextResponse } from "next/server";
import { dispatchCareCircleEmail, SendEmailPayload } from "@/lib/email-engine";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { to, recipientName, subject, notificationType, headline, messageBody, patientName, actionUrl, actionText } = body;

    if (!to || !subject || !headline) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const payload: SendEmailPayload = {
      to,
      recipientName: recipientName || "Family / Caregiver",
      subject,
      notificationType: notificationType || "dose_reminder",
      headline,
      messageBody,
      patientName: patientName || "Eleanor Vance",
      actionUrl,
      actionText,
    };

    const deliveryRecord = await dispatchCareCircleEmail(payload);

    return NextResponse.json({
      success: true,
      delivery: deliveryRecord,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

