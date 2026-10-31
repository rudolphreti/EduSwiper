import { z } from 'zod';
export const legacyCanvasSchema = z.object({
  left: z.number().finite(),
  top: z.number().finite(),
  width: z.number().positive().finite(),
  height: z.number().positive().finite(),
  naturalWidth: z.number().positive().finite().optional(),
  naturalHeight: z.number().positive().finite().optional(),
});
export const legacyCardMetadataSchema = z
  .object({
    canvasData: legacyCanvasSchema.optional(),
    templatesData: z
      .object({
        ECO4onA4: legacyCanvasSchema.optional(),
        CLASSIC2onA4: legacyCanvasSchema.optional(),
      })
      .optional(),
    fontSize: z.union([z.number().finite(), z.string().max(100)]).optional(),
  })
  .strict();
