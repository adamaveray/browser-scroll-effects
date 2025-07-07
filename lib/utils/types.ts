export type RequiredOptions<TOptions, TDefaults extends Partial<keyof TOptions>> = Omit<TOptions, TDefaults> & {
  [K in TDefaults]?: TOptions[K];
};
