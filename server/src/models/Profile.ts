import { Schema, model } from 'mongoose';

export interface ILocaleString {
  en: string;
  de: string;
}

export interface IExperienceEntry {
  company: string;
  role: ILocaleString;
  startDate: string;
  endDate: string | null;
  bullets: ILocaleString[];
}

export interface IEducationEntry {
  institution: string;
  degree: ILocaleString;
  field?: ILocaleString;
  startDate: string;
  endDate: string | null;
}

export interface IProfile {
  name: string;
  tagline: ILocaleString;
  summary: ILocaleString;
  links: {
    github?: string;
    linkedin?: string;
    email?: string;
  };
  skills: string[];
  experience: IExperienceEntry[];
  education: IEducationEntry[];
}

export const localeStringSchema = new Schema<ILocaleString>(
  {
    en: { type: String, required: true, maxlength: 2000 },
    de: { type: String, required: true, maxlength: 2000 },
  },
  { _id: false },
);

const experienceSchema = new Schema<IExperienceEntry>(
  {
    company: { type: String, required: true, maxlength: 200 },
    role: { type: localeStringSchema, required: true },
    startDate: { type: String, required: true, maxlength: 7 },
    endDate: { type: String, default: null, maxlength: 7 },
    bullets: [{ type: localeStringSchema }],
  },
  { _id: false },
);

const educationSchema = new Schema<IEducationEntry>(
  {
    institution: { type: String, required: true, maxlength: 200 },
    degree: { type: localeStringSchema, required: true },
    field: { type: localeStringSchema },
    startDate: { type: String, required: true, maxlength: 7 },
    endDate: { type: String, default: null, maxlength: 7 },
  },
  { _id: false },
);

const profileSchema = new Schema<IProfile>({
  name: { type: String, required: true, maxlength: 100 },
  tagline: { type: localeStringSchema, required: true },
  summary: { type: localeStringSchema, required: true },
  links: {
    github: { type: String, maxlength: 500 },
    linkedin: { type: String, maxlength: 500 },
    email: { type: String, maxlength: 254 },
  },
  skills: [{ type: String, maxlength: 50 }],
  experience: [experienceSchema],
  education: [educationSchema],
});

const Profile = model<IProfile>('Profile', profileSchema);

export default Profile;
