import { Injectable } from '@angular/core';

import { GnroIcon, GnroFontIcon, GnroSvgIcon } from './icon';

export interface GnroIcons {
  [key: string]: GnroIcon | string;
}

export interface GnroIconPack {
  name: string;
  icons: Map<string, GnroIcon | string>;
  params: GnroIconPackParams;
  type: GnroIconPackType;
}

export enum GnroIconPackType {
  SVG = 'svg',
  FONT = 'font',
}

export interface GnroIconPackParams {
  packClass?: string;
  [name: string]: string | undefined;
  iconClassPrefix?: string;
}

export class GnroIconDefinition {
  name!: string;
  pack!: string;
  icon!: GnroIcon;
}

@Injectable({ providedIn: 'root' })
export class GnroIconLibraries {
  protected packs: Map<string, GnroIconPack> = new Map();
  protected defaultPack!: GnroIconPack | undefined;

  registerSvgPack(name: string, icons: GnroIcons, params: GnroIconPackParams = {}) {
    this.packs.set(name, {
      name,
      icons: new Map(Object.entries(icons)),
      params,
      type: GnroIconPackType.SVG,
    });
  }

  registerFontPack(name: string, params: GnroIconPackParams = {}) {
    this.packs.set(name, {
      name,
      icons: new Map(),
      params,
      type: GnroIconPackType.FONT,
    });
  }

  setDefaultPack(name: string) {
    this.defaultPack = this.packs.get(name);
  }

  getSvgIcon(name: string, pack?: string): GnroIconDefinition | null {
    const iconPack = pack ? this.packs.get(pack) : this.defaultPack;
    if (iconPack) {
      const icon = iconPack.icons.has(name) ? iconPack.icons.get(name) : null;

      if (!icon) {
        return null;
      }

      return {
        name,
        pack: iconPack.name,
        icon: new GnroSvgIcon(name, icon, iconPack.params),
      };
    }
    return null;
  }

  getFontIcon(name: string, pack?: string): GnroIconDefinition | null {
    const iconsPack = pack ? this.packs.get(pack) : this.defaultPack;
    if (iconsPack) {
      return {
        name,
        pack: iconsPack.name,
        icon: new GnroFontIcon(name, iconsPack.params),
      };
    }
    return null;
  }

  getIcon(name: string, pack?: string): GnroIconDefinition | null {
    const iconPack = pack ? this.packs.get(pack) : this.defaultPack;
    if (iconPack) {
      if (iconPack.type === GnroIconPackType.SVG) {
        return this.getSvgIcon(name, pack);
      }
    }

    return this.getFontIcon(name, pack);
  }
}
