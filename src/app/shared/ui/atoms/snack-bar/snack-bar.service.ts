import { computed, inject, Injectable, signal } from '@angular/core';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';

enum SnackBarClassessEnum {
  error = 'snack-error',
  info = 'snack-info'
}

@Injectable({
  providedIn: 'root'
})
export class SnackBarService {
  #snackBar = inject(MatSnackBar);

  #horizontalPosition = signal<MatSnackBarHorizontalPosition>('center');
  #verticalPosition = signal<MatSnackBarVerticalPosition>('top');

  getHorizontalPosition = computed(() => this.#horizontalPosition());
  getVerticalPosition = computed(() => this.#verticalPosition());

  setHorizontalPosition = (positon: MatSnackBarHorizontalPosition) => this.#horizontalPosition.update(() => positon);
  setVerticalPosition = (positon: MatSnackBarVerticalPosition) => this.#verticalPosition.update(() => positon);

  openErrorSnackBar(props: { message: string, actionButtonText?: string }): void {
    const { message, actionButtonText } = props;
    this.openSnackBar({ message, actionButtonText, panelClass: [SnackBarClassessEnum.error] });
  }

  openInfoSnackBar(props: { message: string, actionButtonText?: string }): void {
    const { message, actionButtonText } = props;
    this.openSnackBar({ message, actionButtonText, panelClass: [SnackBarClassessEnum.info] });
  }

  openSnackBar(props: { message: string, actionButtonText?: string, panelClass?: string[] }): void {
    const { message, actionButtonText, panelClass } = props;
    this.#snackBar.open(message, actionButtonText, {
      horizontalPosition: this.getHorizontalPosition(),
      verticalPosition: this.getVerticalPosition(),
      panelClass
    });
  }
}
