import { db } from "@/lib/db";
import { LEGAL_VERSIONS, type LegalDoc } from "@/lib/constants";

export interface ConsentStatusEntry {
  type: LegalDoc;
  version: string;
  consented: boolean;
}

export async function getConsentStatus(
  userId: string,
): Promise<ConsentStatusEntry[]> {
  const rows = await db.userConsent.findMany({
    where: { userId, granted: true },
    select: { consentType: true, version: true },
  });
  const consented = new Set(rows.map((r) => `${r.consentType}:${r.version}`));

  return (Object.keys(LEGAL_VERSIONS) as LegalDoc[]).map((type) => ({
    type,
    version: LEGAL_VERSIONS[type],
    consented: consented.has(`${type}:${LEGAL_VERSIONS[type]}`),
  }));
}

export function needsConsent(status: ConsentStatusEntry[]): boolean {
  return status.some((entry) => !entry.consented);
}

export async function recordConsent(
  userId: string,
  ipAddress: string | null,
): Promise<void> {
  for (const type of Object.keys(LEGAL_VERSIONS) as LegalDoc[]) {
    const version = LEGAL_VERSIONS[type];
    const existing = await db.userConsent.findFirst({
      where: { userId, consentType: type, version },
      select: { id: true },
    });
    if (!existing) {
      await db.userConsent.create({
        data: {
          userId,
          consentType: type,
          version,
          granted: true,
          ipAddress,
        },
      });
    }
  }
}
