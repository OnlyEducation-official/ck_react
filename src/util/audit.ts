type AuditFields =
  | { createdby: string; }
  | { updatedby: string; };

export function getAuditFields(isEdit: boolean, user: string | null): AuditFields {
  const iso = new Date().toISOString();
  const safeUser = user ?? ""; // or "system"

  return isEdit
    ? { updatedby: safeUser }
    : { createdby: safeUser };
}
