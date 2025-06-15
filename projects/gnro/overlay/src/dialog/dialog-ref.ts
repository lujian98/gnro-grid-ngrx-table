import { ComponentRef } from '@angular/core';
import { OverlayRef } from '@angular/cdk/overlay';
import { Subject, Observable } from 'rxjs';

export class GnroDialogRef<T> {
  private onClose$: Subject<object | string | boolean> = new Subject();
  readonly onClose: Observable<object | string | boolean> = this.onClose$.asObservable();
  componentRef!: ComponentRef<T>;

  constructor(private overlayRef: OverlayRef) {}

  close(res?: object | string | boolean): void {
    this.overlayRef.detach();
    this.overlayRef.dispose();
    this.onClose$.next(res!);
    this.onClose$.complete();
  }
}
