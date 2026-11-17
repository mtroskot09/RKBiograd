// Uploads an image to /api/images (stored in the database) and returns its URL.
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
export const IMAGE_ACCEPT = "image/jpeg,image/png,image/webp,image/gif";

export async function uploadImage(file: File): Promise<string> {
  if (file.size > MAX_IMAGE_BYTES) {
    throw new Error("Fotografija je veća od 5 MB");
  }

  const res = await fetch("/api/images", {
    method: "POST",
    headers: { "Content-Type": file.type },
    body: file,
    credentials: "include",
  });
  if (res.status === 401) {
    window.location.href = "/api/login";
    throw new Error("Sesija je istekla");
  }
  const body = await res.json();
  if (!res.ok) {
    throw new Error(body.error || body.message || "Učitavanje fotografije nije uspjelo");
  }
  return body.url as string;
}
