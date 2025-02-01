export const ApplicationEnvirontment = {
  PRODUCTION: "production",
  DEVELOPMENT: "development",
};

export type TApplicationEnvirontment =
  (typeof ApplicationEnvirontment)[keyof typeof ApplicationEnvirontment];
