import { ComponentPortal } from '@angular/cdk/portal';
import { ComponentRef, ElementRef, inject, Injectable, OnDestroy, TemplateRef, Type } from '@angular/core';
import {
  GnroOverlayRef,
  GnroOverlayService,
  GnroOverlayServiceConfig,
  GnroPosition,
  GnroPositionBuilderService,
  GnroTrigger,
  GnroTriggerStrategy,
  GnroTriggerStrategyBuilderService,
  Point,
} from '@gnro/ui/overlay';
import { GnroPopoverContainer } from './popover.model';

@Injectable()
export class GnroPopoverService<T> implements OnDestroy {
  private overlayPositionBuilder = inject(GnroPositionBuilderService);
  private overlayService = inject(GnroOverlayService);
  private triggerStrategyBuilder = inject(GnroTriggerStrategyBuilderService);
  private componentType!: Type<GnroPopoverContainer>;
  private context: Object = {};
  private content!: Type<T> | TemplateRef<T> | string;
  private hostElement!: ElementRef;
  private overlayRef!: GnroOverlayRef | null;
  private containerRef!: ComponentRef<GnroPopoverContainer> | null | undefined;
  private triggerStrategy!: GnroTriggerStrategy;
  private overlayServiceConfig!: GnroOverlayServiceConfig;

  build(
    componentType: Type<GnroPopoverContainer>,
    hostElement: ElementRef,
    overlayServiceConfig: GnroOverlayServiceConfig,
    content: Type<T> | TemplateRef<T> | string,
    context: {},
  ): void {
    this.componentType = componentType;
    this.overlayServiceConfig = overlayServiceConfig;

    this.hostElement =
      overlayServiceConfig?.event && overlayServiceConfig.trigger === GnroTrigger.POINT
        ? this.getFakeElement(overlayServiceConfig?.event)
        : hostElement;

    this.content = content;
    this.context = context;

    if (this.triggerStrategy) {
      this.triggerStrategy.destroy();
    }
    this.triggerStrategy = this.triggerStrategyBuilder.build(
      this.hostElement.nativeElement,
      () => this.container()!,
      this.overlayServiceConfig.trigger,
    );
    this.triggerStrategy.clickToClose = this.overlayServiceConfig.clickToClose;
    this.triggerStrategy.show$.subscribe((event: Event) => {
      this.show(event);
    });
    this.triggerStrategy.hide$.subscribe((event: Event) => {
      if (this.canOverlayClose(event)) {
        this.hide();
      }
    });
  }

  private canOverlayClose(event: Event): boolean {
    if (event.type === 'click' || event.type === 'mousemove') {
      if (this.overlayServiceConfig.clickToClose) {
        return true;
      }
      return this.overlayService.isOverlayColasable(this.overlayServiceConfig.popoverLevel!) ? true : false;
    }
    return true;
  }

  rebuild(context: {}, content: Type<T> | TemplateRef<T> | string): void {
    this.context = context;
    this.content = content;
    if (this.containerRef) {
      this.updateContext();
    }
  }

  private createOverlay(event: Event | null = null): void {
    const positionStrategy = this.createPositionStrategy(event as MouseEvent);
    this.overlayRef = this.overlayService.create({
      scrollStrategy: this.overlayService.scrollStrategies.close(),
      positionStrategy,
    });
    this.overlayService.add(this.overlayRef, this.overlayServiceConfig.popoverLevel!);
  }

  private getFakeElement(event: MouseEvent): ElementRef {
    return new ElementRef({
      getBoundingClientRect: () => ({
        bottom: event.clientY,
        height: 0,
        left: event.clientX,
        right: event.clientX,
        top: event.clientY,
        width: 0,
      }),
    });
  }

  private createPositionStrategy(event: MouseEvent | null = null) {
    let origin: ElementRef | Point = this.hostElement;
    if (this.overlayServiceConfig?.trigger === GnroTrigger.CONTEXTMENU && event) {
      origin = {
        x: event.clientX,
        y: event.clientY,
      };
      this.overlayServiceConfig.position = GnroPosition.BOTTOMRIGHT;
    }
    return this.overlayPositionBuilder.flexibleConnectedTo(origin, this.overlayServiceConfig.position);
  }

  private container(): ComponentRef<GnroPopoverContainer> {
    return this.containerRef!;
  }

  show(event: Event | null = null): void {
    if (this.overlayServiceConfig?.trigger === GnroTrigger.CONTEXTMENU && event) {
      this.hide();
      this.overlayRef = null;
    }

    if (this.containerRef) {
      return;
    }
    if (!this.overlayRef) {
      this.createOverlay(event);
    }
    this.containerRef = this.overlayRef?.attach(new ComponentPortal(this.componentType, null, null));
    this.updateContext();
  }

  hide(): void {
    this.overlayService.remove(this.overlayRef);
    this.overlayRef?.detach();
    this.containerRef = null;
    this.overlayRef = null;
  }

  private updateContext(): void {
    if (this.containerRef?.instance) {
      Object.assign(this.containerRef.instance, {
        content: this.content,
        context: this.context,
        customStyle: this.overlayServiceConfig.customStyle,
      });
      this.containerRef.instance.renderContent();
      this.containerRef.changeDetectorRef.detectChanges();
    }
  }

  ngOnDestroy(): void {
    if (this.triggerStrategy) {
      this.triggerStrategy.destroy();
    }
    if (this.overlayRef) {
      this.overlayRef.dispose();
    }
  }
}
