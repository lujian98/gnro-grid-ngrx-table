import { inject, Injectable, NgModule } from '@angular/core';
import { GnroMessageStateModule } from '@gnro/ui/message';
import { EffectsModule } from '@ngrx/effects';
import { ReducerManager } from '@ngrx/store';
import { GnroFormEffects } from './form.effects';
import { createFormReducerForFeature, getFormFeatureKey } from './form.reducer';
import { createFormSelectorsForFeature } from './form.selectors';

// Track registered features to avoid duplicate registration
const registeredFormFeatures = new Set<string>();

@Injectable({ providedIn: 'root' })
export class GnroFormFeatureService {
  private readonly reducerManager = inject(ReducerManager);

  registerFeature(formName: string): void {
    if (registeredFormFeatures.has(formName)) {
      return;
    }

    const featureKey = getFormFeatureKey(formName);
    const reducer = createFormReducerForFeature(formName);

    this.reducerManager.addReducer(featureKey, reducer);
    // Pre-create selectors for this feature
    createFormSelectorsForFeature(formName);
    registeredFormFeatures.add(formName);
  }

  removeFeature(formName: string): void {
    const featureKey = getFormFeatureKey(formName);
    this.reducerManager.removeReducer(featureKey);
    registeredFormFeatures.delete(formName);
  }
}

@NgModule({
  imports: [GnroMessageStateModule, EffectsModule.forFeature([GnroFormEffects])],
})
export class GnroFormStateModule {}
