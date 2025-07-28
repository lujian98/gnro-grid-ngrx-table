import { CdkPortalOutlet, ComponentPortal, PortalModule, TemplatePortal } from '@angular/cdk/portal';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ComponentRef,
  EmbeddedViewRef,
  inject,
  Injector,
  input,
  OnDestroy,
  TemplateRef,
  Type,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { GnroPortalContent } from './portal.model';

@Component({
  selector: 'gnro-portal',
  templateUrl: './portal.component.html',
  styleUrls: ['./portal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PortalModule],
})
export class GnroPortalComponent<T> implements AfterViewInit, OnDestroy {
  private readonly viewContainerRef = inject(ViewContainerRef);
  private isViewReady: boolean = false;
  private componentRef: ComponentRef<T> | undefined;

  content = input<GnroPortalContent<T>, GnroPortalContent<T>>(undefined, {
    transform: (content: GnroPortalContent<T>) => {
      this.detach();
      if (this.isViewReady) {
        this.addPortalContent(content, this.context()!);
      }
      return content;
    },
  });

  context = input(undefined, {
    transform: (context: {}) => {
      if (this.isViewReady) {
        this.updateContext(this.content()!, context);
      }
      return context;
    },
  });

  get isTextContent(): boolean {
    return !(this.content() instanceof Type || this.content() instanceof TemplateRef);
  }

  @ViewChild(CdkPortalOutlet, { static: true }) portalOutlet!: CdkPortalOutlet;

  ngAfterViewInit(): void {
    this.isViewReady = true;
    this.addPortalContent(this.content()!, this.context()!);
  }

  addPortalContent(content: GnroPortalContent<T>, context: Object, injector?: Injector): void {
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

  private updateContext(content: GnroPortalContent<T>, context: Object): void {
    if (content instanceof Type && this.componentRef?.instance) {
      Object.assign(this.componentRef.instance, context);
    } else if (content instanceof TemplateRef) {
      this.detach();
      this.createTemplatePortal(content, context);
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
