import { AfterViewInit, ChangeDetectionStrategy, Component, effect, ElementRef, input, OnDestroy, output, signal, ViewChild } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { map, startWith, Subscription, tap } from 'rxjs';

@Component({
  selector: 'app-autocomplete',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatIconModule
  ],
  templateUrl: './autocomplete.component.html',
  styleUrl: './autocomplete.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AutocompleteComponent implements AfterViewInit, OnDestroy {
  formField = input(new FormControl(''));
  options = input(['']);
  id = input('');
  name = input('');
  label = input('');
  placeholder = input('');
  focus = input(false);
  errorMessage = input('');

  icon = input('');
  idIcon = input('');
  showIcon = input(true);
  
  isLoading = input(false);

  onIconClick = output<void>();

  filteredOptions = signal(['']);

  subscription = new Subscription();

  constructor() {
    this.listenOptions();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  @ViewChild('appInputText') inputRef!: ElementRef<HTMLTextAreaElement>;

  ngAfterViewInit(): void {
    this.setFocus();
  }

  private setFocus(): void {
    if(!this.focus()) return;
    this.inputRef.nativeElement.focus();
  }

  private listenOptions(): void {
    effect(() => {
      this.options();
      this.setFilterOptions();
    });
  }

  private setFilterOptions(): void {
    this.subscription = this.formField().valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
      tap(value => this.filteredOptions.update(() => value))
    ).subscribe();
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options().filter(option => option?.toLowerCase().includes(filterValue));
  }

}
