import { createI18n } from "vue-i18n";

const messages = {
  en: {
    name: "Debo Huang",
    title: "Software Developer",
    home: "Home",
    projects: "Projects",
    comments: "Comments",
    contact: "Contact",
    manageIcons: "Manage Icons",
    other: "Other",
    language: "English",
    loading: "Loading...",
    login: "Login",
    logout: "Logout",
    homePage: {
      skillsTitle: "What I Do",
      techTitle: "Technologies I Use",
      exploreProjects: "Explore My Projects",
      hobbiesTitle: "Hobbies",
      updateAbout: "Update About",
      firstName: "First Name",
      lastName: "Last Name",
      title: "Title",
      description: "Description",
      services: "Services",
      frameworks: "Frameworks",
      technologies: "Technologies",
      hobbies: "Hobbies",
      close: "Close",
      next: "Next",
      previous: "Previous",
      add: "Add",
      save: "Save"
    },
    projectPage: {
      title: "Projects",
      description: "Please select a project to view",
      languages: "Languages",
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
    commentsPage: {
      title: "Comments",
      description: "Please select which comments to see"
    },
    commentsSidebar: {
      title: "Comments",
      verifiedComments: "Verified Comments",
      guestComments: "Guest Comments",
      manageComments: "Manage Comments",
      loginToComment: "Login to leave a verified comment."
    },
    iconsSidebar: {
      title: "Icons",
      languages: "Languages",
      frameworks: "Frameworks",
      technologies: "Technologies",
      services: "Services"
    },
    iconsPage: {
      title: "Icons",
      description: "Please select an item to manage"
    },
    verifiedCommentsPage: {
      title: "Verified Comments",
      allComments: "All Comments",
      myComments: "My Comments",
      noComments: "No comments available.",
      addComment: "Add Comment",
      content: "Content",
      cancel: "Cancel",
      post: "Post",
      close: "Close",
      confirmDeletion: "Confirm Deletion",
      confirmDeletionMessage: "Are you sure you want to delete this comment?",
      delete: "Delete",
      modifyComment: "Modify Comment",
      save: "Save",
      errorMessage: "Failed to fetch comments.",
      createError: "Failed to create comment.",
      deleteError: "Failed to delete comment.",
      modifyError: "Failed to modify comment.",
      successMessage: "Your comment has been created, it will be posted once reviewed by Debo.",
      modifySuccess: "Your comment has been updated, it will be posted once reviewed by Debo."
    },
    guestCommentsPage: {
      title: "Guest Comments",
      noComments: "No guest comments available.",
      addComment: "Add New Comment",
      firstName: "First Name",
      lastName: "Last Name",
      content: "Content",
      cancel: "Cancel",
      post: "Post",
      close: "Close",
      errorMessage: "Failed to fetch guest comments.",
      createError: "Failed to create comment.",
      successMessage: "Your comment has been created, it will be posted once approved by Debo."
    }
  },
  fr: {
    name: "Debo Huang",
    title: "Développeur Logiciel",
    home: "Accueil",
    projects: "Projets",
    comments: "Commentaires",
    contact: "Contact",
    manageIcons: "Gérer les icônes",
    other: "Autre",
    language: "Français",
    loading: "Chargement...",
    login: "Connexion",
    logout: "Déconnexion",
    homePage: {
      skillsTitle: "Ce que je fais",
      techTitle: "Technologies que j’utilise",
      exploreProjects: "Découvrir mes projets",
      hobbiesTitle: "Loisirs",
      updateAbout: "Mettre à jour À propos",
      firstName: "Prénom",
      lastName: "Nom",
      title: "Titre",
      description: "Description",
      services: "Services",
      frameworks: "Frameworks",
      technologies: "Technologies",
      hobbies: "Loisirs",
      close: "Fermer",
      next: "Suivant",
      previous: "Précédent",
      add: "Ajouter",
      save: "Enregistrer"
    },
    projectPage: {
      title: "Projets",
      description: "Veuillez sélectionner un projet à voir",
      languages: "Langages",
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
    commentsPage: {
      title: "Commentaires",
      description: "Veuillez sélectionner les commentaires à voir"
    },
    commentsSidebar: {
      title: "Commentaires",
      verifiedComments: "Commentaires vérifiés",
      guestComments: "Commentaires des visiteurs",
      manageComments: "Gérer les commentaires",
      loginToComment: "Connectez-vous pour laisser un commentaire vérifié."
    },
    iconsSidebar: {
      title: "Icônes",
      languages: "Langages",
      frameworks: "Frameworks",
      technologies: "Technologies",
      services: "Services"
    },
    iconsPage: {
      title: "Icônes",
      description: "Veuillez sélectionner un élément à gérer"
    },
    verifiedCommentsPage: {
      title: "Commentaires vérifiés",
      allComments: "Tous les commentaires",
      myComments: "Mes commentaires",
      noComments: "Aucun commentaire disponible.",
      addComment: "Ajouter un commentaire",
      content: "Contenu",
      cancel: "Annuler",
      post: "Publier",
      close: "Fermer",
      confirmDeletion: "Confirmer la suppression",
      confirmDeletionMessage: "Êtes-vous sûr de vouloir supprimer ce commentaire?",
      delete: "Supprimer",
      modifyComment: "Modifier le commentaire",
      save: "Enregistrer",
      errorMessage: "Échec de la récupération des commentaires.",
      createError: "Échec de la création du commentaire.",
      deleteError: "Échec de la suppression du commentaire.",
      modifyError: "Échec de la modification du commentaire.",
      successMessage: "Votre commentaire a été créé, il sera publié une fois approuvé par Debo.",
      modifySuccess: "Votre commentaire a été modifié, il sera publié une fois approuvé par Debo."
    },
    guestCommentsPage: {
      title: "Commentaires des visiteurs",
      noComments: "Aucun commentaire de visiteur disponible.",
      addComment: "Ajouter un nouveau commentaire",
      firstName: "Prénom",
      lastName: "Nom",
      content: "Contenu",
      cancel: "Annuler",
      post: "Publier",
      close: "Fermer",
      errorMessage: "Échec de la récupération des commentaires des visiteurs.",
      createError: "Échec de la création du commentaire.",
      successMessage: "Votre commentaire a été créé, il sera publié une fois approuvé par Debo."
    }
  },
};

const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: "en",
  fallbackLocale: "en",
  messages,
  allowComposition: true,
  datetimeFormats: {
    en: {
      short: {
        year: 'numeric', month: 'short', day: 'numeric'
      },
      long: {
        year: 'numeric', month: 'long', day: 'numeric'
      }
    },
    fr: {
      short: {
        year: 'numeric', month: 'short', day: 'numeric'
      },
      long: {
        year: 'numeric', month: 'long', day: 'numeric'
      }
    }
  }
});

export default i18n;