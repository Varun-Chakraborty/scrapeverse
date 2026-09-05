import { NextResponse } from "next/server";
import { withApiHandler } from "@/lib/api";
import { requireSession } from "@/lib/session";
import { getConsentStatus, needsConsent, recordConsent } from "@/lib/consent";

export const GET = withApiHandler(async () => {
  const userId = await requireSession();
  const consents = await getConsentStatus(userId);
  return NextResponse.json({
    needsConsent: needsConsent(consents),
    consents,
  });
}, "Consent status");

export const POST = withApiHandler(async (request: Request) => {
  const userId = await requireSession();

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || null;
  await recordConsent(userId, ip);
  const consents = await getConsentStatus(userId);
  return NextResponse.json({
    needsConsent: needsConsent(consents),
    consents,
  });
}, "Record consent");
