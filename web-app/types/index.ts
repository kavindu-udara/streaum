export type Profile = {
  id: string;
  name: string;
  imageURL: string;
  isLocked?: boolean;
};

export type Song = {
  id: string;
  link: string;
  image: string;
  title: string;
  description: string;
};

export type Path = {
  name: string;
  path: string;
  isDirectory: boolean;
  size: number;
  lastModified: string;
  children: Path[];
};

export enum PathActions {
  NEW_FOLDER,
  DELETE,
  FORCE_DELETE,
  RENAME,
  MOVE,
  COPY,
}
