import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
  name: 'count'
})

// This pipe is used to display the number of something in a list
export class CountPipe implements PipeTransform {
  transform(list: any[] | undefined, nounSingular: string): string {
    // If list is undefined, return 0 subjects
    if (!list) {
      return 0 + nounSingular + 's';
    }
    // If list is not undefined, return the length of the list and the subject
    return list.length + ' ' + (list.length === 1 ? nounSingular : nounSingular + 's');
  }
}
