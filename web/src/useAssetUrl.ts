import { useEffect, useState } from 'react';
export function useAssetUrl(bytes: Uint8Array, mime: string): string | undefined {
  const [url, setUrl] = useState<string>();
  useEffect(() => {
    const next = URL.createObjectURL(new Blob([Uint8Array.from(bytes).buffer], { type: mime }));
    setUrl(next);
    return () => URL.revokeObjectURL(next);
  }, [bytes, mime]);
  return url;
}
