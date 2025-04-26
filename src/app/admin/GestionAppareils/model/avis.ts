// avis.ts
import { Appareil } from './appareil';
import { User } from './user';

export interface Avis {
  idAvis?: number;
  contenu: string;
  appareil?: Appareil | null;
  user?: User | null;
  rating?: number;
}
