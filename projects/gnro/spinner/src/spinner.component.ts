import { ChangeDetectionStrategy, Component, HostBinding, input, signal } from '@angular/core';
import { GnroSpinnerSize } from './spinner.model';

@Component({
  selector: 'gnro-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GnroSpinnerComponent {
  size = input('medium', {
    transform: (size: GnroSpinnerSize) => {
      this._size.update(() => size);
      return size;
    },
  });
  message = input('', {
    transform: (message: string) => {
      this._message.update(() => message);
      return message;
    },
  });

  _size = signal<GnroSpinnerSize>('medium');
  _message = signal<string>('');

  @HostBinding('class.size-small')
  get small() {
    return this._size() === 'small';
  }

  @HostBinding('class.size-medium')
  get medium() {
    return this._size() === 'medium';
  }

  @HostBinding('class.size-large')
  get large() {
    return this._size() === 'large';
  }
}
