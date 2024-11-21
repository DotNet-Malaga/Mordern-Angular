import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-progress-bar',
  template: `
    <div class="w-full h-4 bg-gray-200 overflow-hidden">
      <div
        class="h-full transition-all duration-300"
        [class]="getProgressBarClass()"
        [style.width.%]="progress() > 100 ? 100 : progress()">
        @if (progress() > 100) {
          <div class="flex justify-center items-center h-full">
            <span class="text-yellow-300 animate-pulse text-[10px]">⭐</span>
            <span class="text-yellow-400 animate-pulse delay-75 text-[10px]"
              >⭐</span
            >
            <span class="text-yellow-300 animate-pulse delay-150 text-[10px]"
              >⭐</span
            >
          </div>
        }
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgressBarComponent {
  progress = input.required<number>();

  getProgressBarClass(): string {
    if (this.progress() > 100) {
      return 'bg-yellow-500 animate-shine';
    }
    return this.progress() === 100 ? 'bg-green-500' : 'bg-blue-500';
  }
}
