export interface CommentaireDemande {
    idCommentaire?: number;
    content: string;
    dateCreation?: Date;
    user: {
      idUser: number;
    } | null; // 👈 ici on autorise null
    demandeRecyclage: {
      idDemandeRecyclage: number;
    };
  }
  