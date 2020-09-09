export const SceneImports = {
  LogoScene: (): Promise<any> => import('../scenes/LogoScene'),
  SimpleScene: (): Promise<any> => import('../scenes/SimpleScene'),
  CounterScene: (): Promise<any> => import('../counter/CounterScene'),
};

export type SceneIds = keyof typeof SceneImports;
