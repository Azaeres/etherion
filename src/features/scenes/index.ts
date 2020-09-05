export const SceneImports = {
  SimpleScene: (): Promise<any> => import('../scenes/SimpleScene'),
  CounterScene: (): Promise<any> => import('../counter/CounterScene'),
};

export type SceneIds = keyof typeof SceneImports;
