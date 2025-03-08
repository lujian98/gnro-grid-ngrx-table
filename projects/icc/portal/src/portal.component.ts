import { CdkPortalOutlet, ComponentPortal, PortalModule, TemplatePortal } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ComponentRef,
  EmbeddedViewRef,
  inject,
  Injector,
  Input,
  OnDestroy,
  TemplateRef,
  Type,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { IccPortalContent } from './portal.model';

@Component({
  selector: 'icc-portal',
  templateUrl: './portal.component.html',
  styleUrls: ['./portal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, PortalModule],
})
export class IccPortalComponent<T> implements AfterViewInit, OnDestroy {
  private viewContainerRef = inject(ViewContainerRef);
  private isViewReady: boolean = false;
  private componentRef: ComponentRef<T> | undefined;
  private _content!: IccPortalContent<T>;
  private _context!: {};

  @Input()
  set content(content: IccPortalContent<T>) {
    this._content = content;
    if (this.isViewReady) {
      this.addPortalContent(this.content, this.context);
    }
  }
  get content(): IccPortalContent<T> {
    return this._content;
  }

  @Input()
  set context(context: {}) {
    this._context = context;
    if (this.isViewReady) {
      this.updateContext();
    }
  }
  get context(): {} {
    return this._context;
  }

  get isTextContent(): boolean {
    return !(this.content instanceof Type || this.content instanceof TemplateRef);
  }

  @ViewChild(CdkPortalOutlet, { static: true }) portalOutlet!: CdkPortalOutlet;

  ngAfterViewInit(): void {
    this.isViewReady = true;
    this.addPortalContent(this.content, this.context);
  }

  addPortalContent(content: IccPortalContent<T>, context: Object, injector?: Injector): void {
    if (content instanceof Type) {
      this.detach();
      this.componentRef = this.createComponentPortal(content, context, injector);
    } else if (content instanceof TemplateRef) {
      this.createTemplatePortal(content, context);
    }
  }

  createComponentPortal(content: Type<T>, context?: Object, injector?: Injector): ComponentRef<T> {
    const portal = new ComponentPortal(content, null, injector);
    const componentRef = this.attachComponentPortal(portal, context);
    return componentRef;
  }

  createTemplatePortal(content: TemplateRef<T>, context: Object): void {
    const portal = new TemplatePortal(content, this.viewContainerRef, <T>context);
    this.attachTemplatePortal(portal);
  }

  private attachComponentPortal(portal: ComponentPortal<T>, context?: Object): ComponentRef<T> {
    const componentRef = this.portalOutlet.attachComponentPortal(portal);
    if (context && componentRef.instance) {
      Object.assign(componentRef.instance, context);
    }
    componentRef.changeDetectorRef.markForCheck();
    componentRef.changeDetectorRef.detectChanges();
    return componentRef;
  }

  private attachTemplatePortal(portal: TemplatePortal<T>): EmbeddedViewRef<T> {
    const templateRef = this.portalOutlet.attachTemplatePortal(portal);
    templateRef.detectChanges();
    return templateRef;
  }

  private updateContext(): void {
    if (this.content instanceof Type && this.componentRef?.instance) {
      Object.assign(this.componentRef.instance, this.context);
    } else if (this.content instanceof TemplateRef) {
      this.detach();
      this.createTemplatePortal(this.content, this.context);
    }
  }

  detach(): void {
    if (this.portalOutlet.hasAttached()) {
      this.portalOutlet.detach();
    }
  }

  ngOnDestroy(): void {
    this.detach();
  }
}
