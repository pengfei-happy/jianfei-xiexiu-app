export interface RecognitionDraft {
  imageUri?: string;
  imageBase64?: string;
  mimeType?: string;
}

export type RootStackParamList = {
  Main: undefined;
};

export type TabParamList = {
  Home: undefined;
  Recipes: undefined;
  Dashboard: undefined;
  Exercise: undefined;
  Profile: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
