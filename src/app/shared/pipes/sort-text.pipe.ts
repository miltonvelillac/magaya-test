import { Pipe, PipeTransform } from '@angular/core';
import { SortEnum } from '@shared/enums/sort.enum';

@Pipe({
  name: 'sortText',
  standalone: true
})
export class SortTextPipe implements PipeTransform {

  transform(
    values: string[],
    order = SortEnum.asc,
    locale?: string,
    caseInsensitive = true
  ): string[] {
    if (!values?.length) return [];

    const dir = order === SortEnum.desc ? -1 : 1;
    const collator = new Intl.Collator(locale, {
      sensitivity: caseInsensitive ? 'base' : 'variant',
      numeric: true
    });

    return values.filter(val => !!val).sort((a, b) => dir * collator.compare(a, b));
  }

}
