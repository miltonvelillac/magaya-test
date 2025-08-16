import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute } from '@angular/router';
import { CharactersHandlerStore } from '@core/state/characters/handler/characters-handler.store';
import { TextConstant } from '@shared/constants/text.constant';
import { ChipStylesEnum } from '@shared/enums/chip-styles.enum';
import { CharacterModel } from '@shared/models/character.model';
import { ChipsComponent } from '@shared/ui/atoms/chips/chips.component';
import { LabelComponent } from '@shared/ui/atoms/label/label.component';
import { SnackBarService } from '@shared/ui/atoms/snack-bar/snack-bar.service';

@Component({
  selector: 'app-character',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    LabelComponent,
    ChipsComponent,    
],
  templateUrl: './character.component.html',
  styleUrl: './character.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CharacterComponent {
  #charactersHandlerStore = inject(CharactersHandlerStore);
  #route = inject(ActivatedRoute);
  #snackBarService = inject(SnackBarService);

  labels = TextConstant.character;

  id = signal<number | undefined>(undefined);
  selectedCharacter = this.#charactersHandlerStore.selectedCharacter;

  getSelectedCharacter = computed(() => this.selectedCharacter ? this.selectedCharacter() : {} as CharacterModel );
  statusClass = computed(() => {
    if(!this.selectedCharacter) return '';
    switch (this.selectedCharacter()?.status) {
      case 'Alive':
        return ChipStylesEnum.success;
      case 'Dead':
        return ChipStylesEnum.alert;
      default:
        return '';
    }
  })

  constructor() {
    this.setId();
    this.loadCharacterById();
  }

  setId(): void {
    const id = this.#route.snapshot.queryParamMap.get('id');
    if (!id) {
      this.#snackBarService.openErrorSnackBar({ message: this.labels?.idMissing || '', actionButtonText: this.labels.snackbarErrorBtn });
      return;
    };
    this.id.update(() => Number(id));
  }

  loadCharacterById(): void {
    if (!this.id) return;
    this.#charactersHandlerStore.loadCharacterById({ id: this.id() || 0 });
  }

}
