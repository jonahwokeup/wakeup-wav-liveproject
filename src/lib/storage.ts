import { supabase } from "@/lib/supabaseClient";

/**
 * Uploads an image file to the "artwork" storage bucket and returns a public URL.
 * Bucket should exist in Supabase Storage (public read; authenticated write).
 */
export async function uploadArtworkToBucket(file: File, orgId: string) {
  const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
  const key = `${orgId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error } = await supabase
    .storage
    .from("artwork")
    .upload(key, file, {
      cacheControl: "3600",
      upsert: true,
      contentType: file.type || "image/jpeg",
    });

  if (error) throw error;

  const { data: pub } = supabase
    .storage
    .from("artwork")
    .getPublicUrl(key);

  return pub.publicUrl;
}
