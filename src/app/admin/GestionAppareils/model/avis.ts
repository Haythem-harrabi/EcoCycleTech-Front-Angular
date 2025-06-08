// avis.ts
import { Appareil } from './appareil';
import { User } from '../../models/user';

export interface Avis {
  idAvis?: number;
  contenu: string;
  appareil?: Appareil | null;
  user?: User;
  rating?: number;
}
