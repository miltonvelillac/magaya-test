import { animate, style, transition, trigger } from '@angular/animations';
import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CharactersHandlerStore } from '@core/state/characters/handler/characters-handler.store';
import { LocationHandlerStore } from '@core/state/location/handler/location-handler.store';
import { TextConstant } from '@shared/constants/text.constant';
import { ChipStylesEnum } from '@shared/enums/chip-styles.enum';
import { CharacterModel } from '@shared/models/character.model';
import { AvatarComponent } from '@shared/ui/atoms/avatar/avatar.component';
import { ChipsComponent } from '@shared/ui/atoms/chips/chips.component';
import { LabelComponent } from '@shared/ui/atoms/label/label.component';
import { SnackBarService } from '@shared/ui/atoms/snack-bar/snack-bar.service';
import { CardComponent } from '@shared/ui/molecules/card/card.component';
import { RegexUtils } from '@shared/utils/regex/regex.utils';

@Component({
  selector: 'app-character',
  standalone: true,
  imports: [
    LabelComponent,
    ChipsComponent,
    CardComponent,
    AvatarComponent,
  ],
  templateUrl: './character.component.html',
  styleUrl: './character.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('1500ms ease-out',
          style({ opacity: 1 })
        ),
      ]),
    ]),
  ],
})
export class CharacterComponent {
  #charactersHandlerStore = inject(CharactersHandlerStore);
  #locationHandlerStore = inject(LocationHandlerStore);
  #route = inject(ActivatedRoute);
  #snackBarService = inject(SnackBarService);

  labels = TextConstant.character;

  id = signal<number | undefined>(undefined);
  selectedCharacter = this.#charactersHandlerStore.selectedCharacter;
  isLoading = this.#charactersHandlerStore.isLoading;

  selectedLocation = this.#locationHandlerStore.selectedLocation;
  selectedLocationIsLoading = this.#locationHandlerStore.isLoading;

  getSelectedCharacter = computed(() => this.selectedCharacter ? this.selectedCharacter() : {} as CharacterModel);
  statusClass = computed(() => {
    if (!this.selectedCharacter) return '';
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
    this.loadLocation();
  }

  private setId(): void {
    const id = this.#route.snapshot.queryParamMap.get('id');
    if (!id) {
      this.#snackBarService.openErrorSnackBar({ message: this.labels?.idMissing || '', actionButtonText: this.labels.snackbarErrorBtn });
      return;
    };
    this.id.update(() => Number(id));
  }

  private loadCharacterById(): void {
    if (!this.id || !this.id()) return;
    this.#charactersHandlerStore.loadCharacterById({ id: this.id() || 0 });
  }

  private loadLocation(): void {
    effect(() => {
      const url = this.selectedCharacter ? this.selectedCharacter()?.location?.url : '';
      const id = RegexUtils.getCharacterIdFromUrl({ url: url || '' });
      if (!id) return;
      this.#locationHandlerStore.loadLocationById({ id });
    });
  }

}
