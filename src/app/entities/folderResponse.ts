 export interface FolderResponse {
    folder: string;
    files: Array<{
      bytes: number;
      format: string;
      created_at: string;
      url: string;
      public_id: string;
    }>;
    subfolders: FolderResponse[];
  }