import { Schema, model } from 'mongoose';
import type { ILocaleString } from './Profile';
import { localeStringSchema } from './Profile';

export interface IProject {
  slug: string;
  title: string;
  description: ILocaleString;
  techStack: string[];
  githubUrl?: string;
  liveUrl?: string;
  screenshotUrl?: string;
  status?: string;
  order: number;
}

const projectSchema = new Schema<IProject>({
  slug: { type: String, required: true, unique: true, maxlength: 100 },
  title: { type: String, required: true, maxlength: 200 },
  description: { type: localeStringSchema, required: true },
  techStack: [{ type: String, maxlength: 50 }],
  githubUrl: { type: String, maxlength: 500 },
  liveUrl: { type: String, maxlength: 500 },
  screenshotUrl: { type: String, maxlength: 500 },
  status: { type: String, maxlength: 50 },
  order: { type: Number, required: true },
});

const Project = model<IProject>('Project', projectSchema);

export default Project;
