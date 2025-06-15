import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  input,
  OnChanges,
  OnInit,
  Renderer2,
  signal,
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { GnroIconDefinition, GnroIconLibraries } from './icon-libraries';

export type GnroIconStatus = 'default' | 'primary' | 'warning' | 'danger' | 'success';

export interface GnroIconConfig {
  icon: string;
  iconClass?: string | Array<string>;
  status?: GnroIconStatus;
  title?: string;
}

@Component({
  selector: 'gnro-icon',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.title]': 'title',
    '[innerHtml]': 'html',
  },
  standalone: false,
})
export class GnroIconComponent implements OnChanges, OnInit {
  protected iconLibrary = inject(GnroIconLibraries);
  protected elementRef = inject(ElementRef);
  protected renderer = inject(Renderer2);
  protected sanitizer = inject(DomSanitizer);
  protected iconDef!: GnroIconDefinition | void;
  protected prevClasses: string[] = [];
  title!: string | undefined;
  html: SafeHtml = '';
  icon$ = signal<string>('');
  status$ = signal<GnroIconStatus | undefined>(undefined);
  iconClass$ = signal<string | Array<string>>('');

  icon = input('', {
    transform: (icon: string) => {
      this.icon$.set(icon);
      return icon;
    },
  });
  status = input(undefined, {
    transform: (status: GnroIconStatus) => {
      this.status$.set(status);
      return status;
    },
  });
  iconClass = input('', {
    transform: (iconClass: string | Array<string>) => {
      this.iconClass$.set(iconClass);
      return iconClass;
    },
  });
  pack = input<string>('');
  config = input('', {
    transform: (config: string | GnroIconConfig) => {
      if (typeof config === 'string') {
        this.icon$.set(config);
      } else {
        this.icon$.set(config.icon);
        this.status$.set(config.status);
        this.title = config.title;
        this.iconClass$.set(config.iconClass!);
      }
      return config;
    },
  });

  constructor() {} //protected iconLibrary: GnroIconLibraries,

  ngOnInit(): void {
    this.iconDef = this.renderIcon(this.icon$(), this.pack());
  }

  ngOnChanges(): void {
    const iconDef = this.iconLibrary.getIcon(this.icon$(), this.pack());
    if (iconDef) {
      this.iconDef = this.renderIcon(this.icon$(), this.pack());
    } else {
      this.iconDef = this.clearIcon();
    }
  }

  renderIcon(name: string, pack?: string): GnroIconDefinition | undefined {
    const iconDefinition = this.iconLibrary.getIcon(name, pack);
    if (!iconDefinition) {
      return undefined;
    }
    this.assignClasses(iconDefinition.icon.getClasses());
    const content = iconDefinition.icon.getContent();
    if (content && typeof content === 'string') {
      this.html = this.sanitizer.bypassSecurityTrustHtml(content);
    }
    return iconDefinition;
  }

  protected assignClasses(classes: string[]): void {
    if (this.iconClass$()) {
      let klasses: Array<string>;
      if (typeof this.iconClass$() === 'string') {
        klasses = (this.iconClass$() as string).split(' ');
      } else {
        klasses = this.iconClass$() as Array<string>;
      }
      classes = classes.concat(klasses);
    }

    this.prevClasses.forEach((className: string) => {
      this.renderer.removeClass(this.elementRef.nativeElement, className);
    });

    classes.forEach((className: string) => {
      this.renderer.addClass(this.elementRef.nativeElement, className);
    });
    this.prevClasses = classes;
  }

  protected clearIcon(): void {
    this.html = '';
    this.assignClasses([]);
  }
}
