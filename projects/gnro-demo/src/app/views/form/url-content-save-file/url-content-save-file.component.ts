import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-url-content-save-file',
  templateUrl: './url-content-save-file.component.html',
  styleUrls: ['./url-content-save-file.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
})
export class AppUrlContentSaveFileComponent {
  urllinks = [
    'https://www.dormanproducts.com/p-128056-ti81065rd.aspx?parttype=Steering%2520-%2520Tie%2520Rod%2520End&origin=keyword',
    'https://www.dormanproducts.com/p-149173-542-941.aspx?parttype=Steering%2520-%2520Tie%2520Rod%2520End&origin=keyword',
  ];
}
