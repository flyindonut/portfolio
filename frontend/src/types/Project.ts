export interface Project {
  slug: string;
  translations: {
    en: {
      name: string;
      description: string;
    };
    fr: {
      name: string;
      description: string;
    };
  };
  technologies: string[];
  languages: string[]; 
  frameworks: string[];
  startDate: string;
  endDate: string;
  images: string[];
  link: string;
}
