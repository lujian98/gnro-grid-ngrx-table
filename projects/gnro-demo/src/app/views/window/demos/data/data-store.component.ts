import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AppBaseStoreComponent } from './base-store';

@Component({
  selector: 'app-data-store',
  templateUrl: './data-store.component.html',
  styleUrls: ['./data-store.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AppBaseStoreComponent],
})
export class AppDataStoreComponent {
  constructor() {}

  ngOnInit(): void {}
}
