import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'commaSeparator'
})
export class CommaSeparatorPipe implements PipeTransform {

  transform(value: number): string {
    let val = value.toString();
    
    return '';
  }

}
