import { createI18n } from "vue-i18n";

const messages = {
  en: {
    name: "Debo Huang",
    title: "Software Developer",
    home: "Home",
    projects: "Projects",
    comments: "Comments",
    contact: "Contact",
    manageTechStack: "Manage Tech Stack",
    other: "Other",
    language: "English",
    loading: "Loading...",
    login: "Login",
    logout: "Logout",
    homePage: {
      intro: "Welcome to my portfolio! I'm an adaptable developer specializing in fullstack development, security, and cloud computing. I build scalable applications with modern technologies like Vue.js, TypeScript, and Spring Boot.",
      skillsTitle: "What I Do",
      techTitle: "Technologies I Use",
      exploreProjects: "Explore My Projects",
      skills: {
        fullstack: "Fullstack Development",
        database: "Database Design",
        backend: "Backend Development",
        security: "Security & Authentication",
        devops: "DevOps & CI/CD",
        cloud: "Cloud Deployment"
      }
    },
    contactPage: {
      heading: "Contact Me",
      description: "Have a question or want to work together? Fill out the form below or send me an email at {'deemohuang@gmail.com.'}",
      nameLabel: "Name",
      emailLabel: "Email",
      messageLabel: "Message",
      sendButton: "Send Message",
      sending: "Sending...",
      success: "Message sent successfully!",
      error: "Failed to send message. Please try again later.",
      validation: {
        nameRequired: "Name is required.",
        emailRequired: "Email is required.",
        emailInvalid: "Invalid email format.",
        messageRequired: "Message is required.",
      },
    },
  },
  fr: {
    name: "Debo Huang",
    title: "Développeur Logiciel",
    home: "Accueil",
    projects: "Projets",
    comments: "Commentaires",
    contact: "Contact",
    manageTechStack: "Gérer la Tech Stack",
    other: "Autre",
    language: "Français",
    loading: "Chargement...",
    login: "Connexion",
    logout: "Déconnexion",
    homePage: {
      intro: "Bienvenue sur mon portfolio! Je suis un développeur qui s'adapte facilement et je suis spécialisé en développement fullstack, sécurité et cloud computing. Je construis des applications évolutives avec des technologies modernes comme Vue.js, TypeScript et Spring Boot.",
      skillsTitle: "Ce que je fais",
      techTitle: "Technologies que j’utilise",
      exploreProjects: "Découvrir mes projets",
      skills: {
        fullstack: "Développement Fullstack",
        database: "Conception de Bases de Données",
        backend: "Développement Backend",
        security: "Sécurité & Authentification",
        devops: "DevOps & CI/CD",
        cloud: "Déploiement Cloud"
      }
    },
    contactPage: {
      heading: "Me Contacter",
      description: "Vous avez une question ou souhaitez collaborer? Remplissez le formulaire ci-dessous ou envoyez-moi un email à {'deemohuang@gmail.com.'}",
      nameLabel: "Nom",
      emailLabel: "Email",
      messageLabel: "Message",
      sendButton: "Envoyer le message",
      sending: "Envoi...",
      success: "Message envoyé avec succès!",
      error: "Échec de l'envoi du message. Veuillez réessayer plus tard.",
      validation: {
        nameRequired: "Le nom est requis.",
        emailRequired: "L'email est requis.",
        emailInvalid: "Format d'email invalide.",
        messageRequired: "Le message est requis.",
      },
    },
  },
};

const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: "en",
  fallbackLocale: "en",
  messages,
  allowComposition: true,
});

export default i18n;