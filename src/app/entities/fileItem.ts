//contenu de chaque dossier dans ecodrive space

import { ExtensionFichier } from "./fichier";

export interface FileItem {
    id: string;
    name: string;
    type: 'file' | 'folder';
    url?: string;
    format?: string;
    size?: number;
    created_at?: Date;
    path: string;
    extension ?: ExtensionFichier
  }