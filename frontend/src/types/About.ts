export interface About {
  slug: string;
  technologies: string[];
  services: string[];
  firstName: string;
  lastName: string;
  translations: {
    en: {
      title: string;
      description: string;
      hobbies: string;
    };
    fr: {
      title: string;
      description: string;
      hobbies: string;
    };
  };
}