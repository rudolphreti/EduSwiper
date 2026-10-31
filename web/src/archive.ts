import { zipSync, unzipSync, strToU8, strFromU8 } from 'fflate';
import { MAX_PROJECT_BYTES, validateManifest, validateProject, type Project } from './project';
export async function saveProject(project: Project): Promise<Uint8Array> {
  const valid = await validateProject(project);
  const manifestBytes = strToU8(JSON.stringify(valid.manifest));
  if (manifestBytes.length > 2_000_000)
    throw new Error('Manifest projektu przekracza 2 MB. Skróć podpisy.');
  return zipSync(
    {
      'manifest.json': manifestBytes,
      ...Object.fromEntries(Object.entries(valid.data).map(([id, b]) => [`assets/${id}`, b])),
    },
    { level: 0 },
  );
}
export async function openProject(bytes: Uint8Array): Promise<Project> {
  if (bytes.length > MAX_PROJECT_BYTES + 2_000_000) throw new Error('Plik projektu jest za duży.');
  let total = 0;
  let files: Record<string, Uint8Array>;
  try {
    files = unzipSync(bytes, {
      filter: (file) => {
        if (file.name !== 'manifest.json' && !/^assets\/[a-f0-9]{64}$/.test(file.name))
          throw new Error('Nieprawidłowa ścieżka w projekcie.');
        total += file.originalSize;
        if (
          total > MAX_PROJECT_BYTES + 2_000_000 ||
          (file.name === 'manifest.json' && file.originalSize > 2_000_000)
        )
          throw new Error('Rozpakowany projekt jest za duży.');
        return true;
      },
    });
  } catch (e) {
    if (e instanceof Error && /ścieżka|za duży/.test(e.message)) throw e;
    throw new Error('Nieprawidłowy lub uszkodzony plik projektu.');
  }
  if (!files['manifest.json']) throw new Error('Brak manifestu projektu.');
  let input: unknown;
  try {
    input = JSON.parse(strFromU8(files['manifest.json']));
  } catch {
    throw new Error('Nieprawidłowy lub uszkodzony opis projektu.');
  }
  const manifest = validateManifest(input);
  const data = Object.fromEntries(
    Object.entries(files)
      .filter(([name]) => name !== 'manifest.json')
      .map(([name, b]) => [name.slice(7), b]),
  );
  return validateProject({ manifest, data });
}
