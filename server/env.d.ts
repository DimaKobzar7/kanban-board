/// <reference types="node" />

declare namespace NodeJS {
  interface ProcessEnv {
    PORT?: string;
    MONGO_URI: string;
  }
}