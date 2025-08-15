import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { CharactersHandlerStore } from '@core/state/characters/handler/characters-handler.store';
import { LocationHandlerStore } from '@core/state/location/handler/location-handler.store';
import { TextConstant } from '@shared/constants/text.constant';
import { CharacterColumn } from '@shared/types/character-column.type';
import { GlobalSpinnerComponent } from '@shared/ui/atoms/global-spinner/global-spinner.component';
import { TableComponent } from '@shared/ui/atoms/table/table.component';
import { SearchFieldComponent } from '@shared/ui/molecules/search-field/search-field.component';

export enum DimensionsFormNamesEnum {
  dimension = 'dimension'  
}

@Component({
  selector: 'app-dimensions',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    GlobalSpinnerComponent,
    TableComponent,
    SearchFieldComponent
  ],
  templateUrl: './dimensions.component.html',
  styleUrl: './dimensions.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DimensionsComponent {
  #locationHandlerStore = inject(LocationHandlerStore);
  #charactersHandlerStore = inject(CharactersHandlerStore);

  locations = this.#locationHandlerStore.locations;
  isLoading = this.#locationHandlerStore.isLoading;
  errror = this.#locationHandlerStore.error;

  characters = this.#charactersHandlerStore.characters;

  labels = TextConstant.dimension;
  formNames = DimensionsFormNamesEnum;
  form = new FormGroup({
    [this.formNames.dimension]: new FormControl('', [Validators.required])
  });

  pageIndex = signal(0);
  pageSize = signal(10);
  pageLength = signal(0);
  displayedColumns: CharacterColumn[] = ['id', 'name', 'status', 'species', 'gender'];
  charactersData = computed(() => this.characters() || []);

  constructor() {
    this.getLocations();
    this.setDisableForm();
  }

  disableSearchBtn(): boolean {
    return this.isLoading();
  }

  search(): void {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return
    };
    const { dimension } = this.form.value;

    this.#locationHandlerStore.loadLocationsByDimension({ dimension: dimension || '' });
  }

  onPage(e: PageEvent) {
    this.pageIndex.update(() => e.pageIndex);
    this.pageSize.update(() => e.pageSize);
  }

  private getLocations(): void {
    effect(() => {
      console.log(this.locations())
      const locations = this.locations();
      const residentIds: { [key:string]: string } = {};

      locations.forEach(loc => {
        loc.residents.forEach(res => {
          const characterId = res.match(/\/(\d+)(?:\/)?(?:\?.*)?$/)?.[1] || '';
          residentIds[`${characterId}`] = characterId;
        });
      });

      const characterIds = Object.values(residentIds);
      this.#charactersHandlerStore.setCharacterIds({ ids: characterIds });
      console.log(characterIds)
      this.pageLength.update(() => characterIds?.length || 0);

      if(characterIds?.length > 0 ) {
        // Search by 10
        const pageSize = this.pageSize();
        const index = this.pageIndex() * pageSize;
        const indexTo = index + pageSize;
        const idsToSeach = characterIds.slice(index, indexTo);
        this.#charactersHandlerStore.loadCharactersByIds({ ids: idsToSeach });
      } else {
        this.#charactersHandlerStore.setCharacters({ characters: [] });      
      }
    });
  }

  private setDisableForm(): void {
    effect(() => {
      this.isLoading() ? this.form.disable() : this.form.enable();
    });
  }
}
