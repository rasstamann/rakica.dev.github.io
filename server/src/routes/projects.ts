import { Router } from 'express';
import type { Request, Response } from 'express';
import Project from '../models/Project';
import type { IProject } from '../models/Project';
import { resolveLocale, ls } from '../lib/locale';

function flattenProject(project: IProject, locale: ReturnType<typeof resolveLocale>) {
  return {
    slug: project.slug,
    title: project.title,
    description: ls(project.description, locale),
    techStack: project.techStack,
    ...(project.githubUrl ? { githubUrl: project.githubUrl } : {}),
    ...(project.liveUrl ? { liveUrl: project.liveUrl } : {}),
    ...(project.screenshotUrl ? { screenshotUrl: project.screenshotUrl } : {}),
    ...(project.status ? { status: project.status } : {}),
    order: project.order,
  };
}

export async function getProjectsHandler(req: Request, res: Response): Promise<void> {
  try {
    const locale = resolveLocale(req.query?.lang);
    const projects = await Project.find().sort({ order: 1 }).select('-_id -__v').lean<IProject[]>();

    res.json((projects ?? []).map((p) => flattenProject(p, locale)));
  } catch (err) {
    console.error('getProjectsHandler error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export { flattenProject };

const router = Router();
router.get('/', getProjectsHandler);

export default router;
