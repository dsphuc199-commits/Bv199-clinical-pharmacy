import { get, put } from "@vercel/blob";

export type PrivateSnapshot<T> = { data: T; etag?: string };

function storageToken(): string | undefined {
  return process.env.AUTH_ACCOUNTS_BLOB_TOKEN ||
    (process.env.AUTH_ACCOUNTS_USE_PROJECT_BLOB === "1" ? process.env.BLOB_READ_WRITE_TOKEN : undefined);
}

export function adminStorageConfigured(): boolean {
  return !!storageToken();
}

export async function readPrivateJson<T>(
  pathname: string, parse: (value: unknown) => T, empty: T, abortSignal?: AbortSignal,
): Promise<PrivateSnapshot<T>> {
  const token = storageToken();
  if (!token) throw new Error("Private admin storage is not configured");
  // A compressed download uses a weak ETag. Conditional writes require the strong ETag of the stored object.
  const blob = await get(pathname, { access: "private", token, useCache: false, headers: { "Accept-Encoding": "identity" }, abortSignal });
  if (!blob) return { data: empty };
  if (blob.statusCode !== 200) throw new Error("Unexpected private storage response");
  return { data: parse(await new Response(blob.stream).json()), etag: blob.blob.etag };
}

export async function writePrivateJson<T>(
  pathname: string, snapshot: PrivateSnapshot<T>, abortSignal?: AbortSignal,
): Promise<void> {
  const token = storageToken();
  if (!token) throw new Error("Private admin storage is not configured");
  await put(pathname, JSON.stringify(snapshot.data), {
    access: "private", token, contentType: "application/json", addRandomSuffix: false,
    allowOverwrite: !!snapshot.etag, ifMatch: snapshot.etag, abortSignal,
  });
}
