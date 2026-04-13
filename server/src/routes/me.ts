import { Router } from 'express';
import type { Request, Response } from 'express';
import Profile from '../models/Profile';
import type { IProfile } from '../models/Profile';
import { resolveLocale, ls } from '../lib/locale';
import type { SupportedLocale } from '../lib/locale';

export { resolveLocale };
export type { SupportedLocale };

export function flattenProfile(profile: IProfile, locale: SupportedLocale) {
  return {
    name: profile.name,
    tagline: ls(profile.tagline, locale),
    summary: ls(profile.summary, locale),
    links: profile.links,
    skills: profile.skills,
    experience: profile.experience.map((e) => ({
      company: e.company,
      role: ls(e.role, locale),
      startDate: e.startDate,
      endDate: e.endDate,
      bullets: e.bullets.map((b) => ls(b, locale)),
    })),
    education: profile.education.map((e) => ({
      institution: e.institution,
      degree: ls(e.degree, locale),
      ...(e.field ? { field: ls(e.field, locale) } : {}),
      startDate: e.startDate,
      endDate: e.endDate,
    })),
  };
}

export async function getMeHandler(req: Request, res: Response): Promise<void> {
  try {
    const locale = resolveLocale(req.query?.lang);
    const profile = await Profile.findOne().select('-_id -__v').lean<IProfile>();

    if (!profile) {
      res.status(404).json({ error: 'Profile not found' });
      return;
    }

    res.json(flattenProfile(profile, locale));
  } catch (err) {
    console.error('getMeHandler error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

const router = Router();
router.get('/', getMeHandler);

export default router;
