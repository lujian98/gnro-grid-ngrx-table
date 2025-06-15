import {
  ConnectionPositionPair,
  FlexibleConnectedPositionStrategy,
  GlobalPositionStrategy,
  OverlayPositionBuilder,
} from '@angular/cdk/overlay';
import { ElementRef, Inject, Injectable } from '@angular/core';
import { GNRO_DOCUMENT } from '@gnro/ui/theme';
import { GnroPosition } from './overlay-position';

export interface Point {
  x: number;
  y: number;
}

const POSITIONS = {
  [GnroPosition.TOP](offset: number): ConnectionPositionPair {
    return {
      originX: 'center',
      originY: 'top',
      overlayX: 'center',
      overlayY: 'bottom',
      offsetY: -offset,
    };
  },
  [GnroPosition.BOTTOM](offset: number): ConnectionPositionPair {
    return {
      originX: 'center',
      originY: 'bottom',
      overlayX: 'center',
      overlayY: 'top',
      offsetY: offset,
    };
  },
  [GnroPosition.LEFT](offset: number): ConnectionPositionPair {
    return {
      originX: 'start',
      originY: 'center',
      overlayX: 'end',
      overlayY: 'center',
      offsetX: -offset,
    };
  },
  [GnroPosition.RIGHT](offset: number): ConnectionPositionPair {
    return {
      originX: 'end',
      originY: 'center',
      overlayX: 'start',
      overlayY: 'center',
      offsetX: offset,
    };
  },
  [GnroPosition.BOTTOM_END](offset: number): ConnectionPositionPair {
    return {
      originX: 'start',
      originY: 'bottom',
      overlayX: 'start',
      overlayY: 'top',
      offsetY: offset,
    };
  },
  [GnroPosition.BOTTOMRIGHT](offset: number): ConnectionPositionPair {
    return {
      originX: 'end',
      originY: 'bottom',
      overlayX: 'start',
      overlayY: 'top',
      offsetX: offset,
      offsetY: offset - 6,
    };
  },
  [GnroPosition.RIGHTBOTTOM](offset: number): ConnectionPositionPair {
    return {
      originX: 'end',
      originY: 'bottom',
      overlayX: 'start',
      overlayY: 'top',
      offsetX: offset - 10,
      offsetY: -3 * offset,
    };
  },
};

@Injectable()
export class GnroPositionBuilderService {
  constructor(
    @Inject(GNRO_DOCUMENT) protected document: Document,
    protected overlayPositionBuilder: OverlayPositionBuilder,
  ) {}

  global(): GlobalPositionStrategy {
    return new GlobalPositionStrategy();
  }

  flexibleConnectedTo(
    elementRef: ElementRef | Point,
    position: GnroPosition,
    offset: number = 8,
  ): FlexibleConnectedPositionStrategy {
    const connectedPosition = POSITIONS[position](offset);
    const positions = [];
    positions.push(connectedPosition);
    return this.overlayPositionBuilder.flexibleConnectedTo(elementRef).withPositions(positions);
  }
}
