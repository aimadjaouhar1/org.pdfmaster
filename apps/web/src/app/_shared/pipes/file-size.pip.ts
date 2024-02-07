import { Pipe, PipeTransform } from '@angular/core';

const units = ['B', 'Kb', 'Mb', 'Gb'];

@Pipe({
  name: 'fileSize',
  standalone: true
})
export class FileSizePipe implements PipeTransform {
  transform(sizeInBytes: number): string {
    let power = Math.round(Math.log(sizeInBytes) / Math.log(1024));
    power = Math.min(power, units.length - 1);

    const size = sizeInBytes / Math.pow(1024, power);
    const formattedSize = Math.round(size * 100) / 100;
    const unit = units[power];

    return (formattedSize < 1 && power > 0) ? `${(sizeInBytes / 1024).toFixed(2)} ${units[1]}` : `${formattedSize} ${unit}`;
  }
}