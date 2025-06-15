export interface GnroLanguage {
  isocode: string;
  name?: string;
  nativeName?: string;
}

export const languages: GnroLanguage[] = [
  {
    isocode: 'en-US',
    name: 'English',
    nativeName: 'English',
  },
  {
    isocode: 'de',
    name: 'German',
    nativeName: 'Deutsch',
  },
  {
    isocode: 'fr',
    name: 'French',
    nativeName: 'Français',
  },
  {
    isocode: 'ja',
    name: 'Japanese',
    nativeName: '日本',
  },
  {
    isocode: 'zh-CN',
    name: 'Simplified Chinese',
    nativeName: '简体中文',
  },
];
