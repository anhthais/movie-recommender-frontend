export const AiOption = {
  NAVIGATE: 'Navigate',
  LIST: 'Search',
  NATURAL_TEXT: 'Chat',
}

export enum NavigationRoute {
  SEARCH_PAGE = 'SEARCH_PAGE',
  CAST_PAGE = 'CAST_PAGE',
  GENRE_PAGE = 'GENRE_PAGE',
  MOVIE_PAGE = 'MOVIE_PAGE',
  PROFILE_PAGE = 'PROFILE_PAGE',
  NONE = 'NONE',
}

export interface AiNavigation {
  route: NavigationRoute,
  params: any;
  metadata: any;
  is_success: boolean;
}

export type RetrieverResult = {
  result: [];
};