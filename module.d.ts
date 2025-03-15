declare namespace NodeJS {
  export interface ProcessEnv {
    DATABASE_URL: string;
    JWT_SECRET_KEY: string;
    JWT_REFRESH_TOKEN_KEY: string;
    SERVER_URL: string;
    CLIENT_URL: string;
    GMAIL_EMAIL: string;
    GMAIL_APP_PASSWORD: string;
  }
}
