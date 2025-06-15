import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  InjectionToken,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
  booleanAttribute,
  inject,
} from '@angular/core';
import { GnroTabContentDirective } from '../../directives/tab-content.directive';
import { GNRO_TAB, GnroTabLabelDirective } from '../../directives/tab-label.directive';
import { TemplatePortal } from '@angular/cdk/portal';
import { Subject } from 'rxjs';

export const GNRO_TAB_GROUP = new InjectionToken<any>('GNRO_TAB_GROUP');

@Component({
  selector: 'gnro-tab',
  templateUrl: './tab.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  exportAs: 'gnroTab',
  providers: [{ provide: GNRO_TAB, useExisting: GnroTabComponent }],
  host: {
    hidden: '',
  },
})
export class GnroTabComponent implements OnInit, OnChanges, OnDestroy {
  private _viewContainerRef = inject(ViewContainerRef);
  _closestTabGroup = inject(GNRO_TAB_GROUP, { optional: true });

  @Input({ transform: booleanAttribute })
  disabled: boolean = false;

  @ContentChild(GnroTabLabelDirective)
  get templateLabel(): GnroTabLabelDirective {
    return this._templateLabel;
  }
  set templateLabel(value: GnroTabLabelDirective) {
    this._setTemplateLabelInput(value);
  }
  private _templateLabel!: GnroTabLabelDirective;

  @ContentChild(GnroTabContentDirective, { read: TemplateRef, static: true })
  private _explicitContent: TemplateRef<any> = undefined!;

  @ViewChild(TemplateRef, { static: true }) _implicitContent!: TemplateRef<any>;

  @Input('label') textLabel: string = '';
  @Input('aria-label') ariaLabel!: string;
  @Input('aria-labelledby') ariaLabelledby!: string;
  @Input() labelClass!: string | string[];
  @Input() bodyClass!: string | string[];

  private _contentPortal: TemplatePortal | null = null;

  get content(): TemplatePortal | null {
    return this._contentPortal;
  }

  readonly _stateChanges = new Subject<void>();
  position: number | null = null;
  origin: number | null = null;
  isActive = false;

  constructor(...args: unknown[]);
  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.hasOwnProperty('textLabel') || changes.hasOwnProperty('disabled')) {
      this._stateChanges.next();
    }
  }

  ngOnDestroy(): void {
    this._stateChanges.complete();
  }

  ngOnInit(): void {
    this._contentPortal = new TemplatePortal(this._explicitContent || this._implicitContent, this._viewContainerRef);
  }

  private _setTemplateLabelInput(value: GnroTabLabelDirective | undefined) {
    if (value && value._closestTab === this) {
      this._templateLabel = value;
    }
  }
}
