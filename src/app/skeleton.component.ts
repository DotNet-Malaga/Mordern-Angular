import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  computed,
  input,
} from '@angular/core';

import { extendTailwindMerge } from 'tailwind-merge';

export const cn = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [
        'text-title-1',
        'text-title-2',
        'text-title-3',
        'text-title-4',
        'text-title-5',
        'text-body',
        'text-body-big',
        'text-body-link',
        'text-body-caption',
        'text-body-footnote',
      ],
    },
  },
});
export type ClassNameValue = Parameters<typeof cn>[0];

@Component({
  selector: 'ui-skeleton',
  host: { '[class]': 'computedClass()' },
  template: ` <ng-content /> `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Skeleton {
  readonly class = input('');
  readonly computedClass = computed(() =>
    cn('block', 'animate-pulse rounded-md bg-gray-200', this.class())
  );
}
