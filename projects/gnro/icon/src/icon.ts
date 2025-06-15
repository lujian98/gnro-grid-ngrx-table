import { GnroIconPackParams } from './icon-libraries';

export interface GnroIcon {
  getClasses(): string[];
  getContent(): string | GnroIcon | null;
}
export class GnroSvgIcon implements GnroIcon {
  constructor(
    protected name: string,
    protected content: string | GnroIcon,
    protected params: GnroIconPackParams = {},
  ) {}

  getClasses(): string[] {
    const classes = [];

    if (this.params.packClass) {
      classes.push(this.params.packClass);
    }
    return classes;
  }

  getContent(): string | GnroIcon | null {
    return this.content;
  }
}

export class GnroFontIcon implements GnroIcon {
  constructor(
    protected name: string,
    protected params: GnroIconPackParams = {},
  ) {}

  getClasses(): string[] {
    const classes = [];

    if (this.params.packClass) {
      classes.push(this.params.packClass);
    }

    const name = this.params.iconClassPrefix ? `${this.params.iconClassPrefix}-${this.name}` : this.name;
    classes.push(name);

    return classes;
  }

  getContent(): string | null {
    return null;
  }
}
