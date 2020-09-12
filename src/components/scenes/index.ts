export const SceneImports = {
  LogoScene: (): Promise<any> => import('./LogoScene'),
  SimpleScene: (): Promise<any> => import('./SimpleScene'),
  CounterScene: (): Promise<any> => import('../counter/CounterScene'),
};

export type SceneIds = keyof typeof SceneImports;
