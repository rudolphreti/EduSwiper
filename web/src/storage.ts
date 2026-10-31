import { openDB } from 'idb';
import { validateProject, type Project } from './project';
const connect = () =>
  openDB('eduswiper-v1', 1, {
    upgrade(db) {
      db.createObjectStore('drafts');
    },
  });
export async function saveDraft(project: Project): Promise<void> {
  const snapshot = structuredClone(project);
  await validateProject(snapshot);
  const db = await connect();
  try {
    await db.put('drafts', snapshot, 'current');
  } finally {
    db.close();
  }
}
export async function loadDraft(): Promise<Project | null> {
  const db = await connect();
  try {
    const value = await db.get('drafts', 'current');
    return value ? await validateProject(value) : null;
  } finally {
    db.close();
  }
}
