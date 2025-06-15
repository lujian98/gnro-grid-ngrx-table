import { TemplateRef, Type } from '@angular/core';

export type GnroPortalContent<T> = string | TemplateRef<T> | Type<T>;
