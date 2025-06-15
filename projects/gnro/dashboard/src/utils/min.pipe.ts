import { Pipe, PipeTransform } from '@angular/core'; // NOT USED

@Pipe({
  name: 'min',
})
export class MinPipe implements PipeTransform {
  public transform(value: number, ...args: number[]): number {
    // Take 'value' as fallback for undefined & 0
    const max: number = Number(String(args.shift() || 0)) || value;
    const min: number = Math.min(value, max);
    return args.length ? this.transform(min, ...args) : min;
  }
}
