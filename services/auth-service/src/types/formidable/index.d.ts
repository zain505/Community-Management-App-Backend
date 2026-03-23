declare module 'formidable' {
  import type { IncomingMessage } from 'node:http';

  export interface Part {
    name: string;
    originalFilename?: string | null;
    mimetype?: string | null;
  }

  export interface File {
    filepath: string;
    originalFilename?: string | null;
    mimetype?: string | null;
    newFilename: string;
    size: number;
  }

  export interface Files {
    [fieldName: string]: File | File[] | undefined;
  }

  export interface Fields {
    [fieldName: string]: string | string[] | undefined;
  }

  export interface Options {
    uploadDir?: string;
    keepExtensions?: boolean;
    allowEmptyFiles?: boolean;
    minFileSize?: number;
    maxFiles?: number;
    maxFileSize?: number;
    filter?: (part: Part) => boolean;
  }

  export interface FormidableInstance {
    parse(request: IncomingMessage): Promise<[Fields, Files]>;
  }

  export default function formidable(options?: Options): FormidableInstance;
}
