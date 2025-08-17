import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';

import { signal } from '@angular/core';
import { CharactersHandlerStore } from '@core/state/characters/handler/characters-handler.store';
import { LocationHandlerStore } from '@core/state/location/handler/location-handler.store';
import { TextConstant } from '@shared/constants/text.constant';
import { CharacterModel } from '@shared/models/character.model';
import { LocationModel } from '@shared/models/location.model';
import { SnackBarService } from '@shared/ui/atoms/snack-bar/snack-bar.service';
import { MockProvider } from 'ng-mocks';
import { CharacterComponent } from './character.component';

describe('CharacterComponent', () => {
  let component: CharacterComponent;
  let fixture: ComponentFixture<CharacterComponent>;

  let activatedRoute: ActivatedRoute;
  let charactersHandlerStore: CharactersHandlerStore;
  let locationHandlerStore: LocationHandlerStore;
  let snackBarService: SnackBarService;

  const createInstance = () => {
    fixture = TestBed.createComponent(CharacterComponent);
    component = fixture.componentInstance;
  }

  const initTest = () => {
    fixture.detectChanges();
  }

  const setSpys = () => {
    charactersHandlerStore.selectedCharacter = signal({} as CharacterModel);
    charactersHandlerStore.isLoading = signal(false);
    locationHandlerStore.selectedLocation = signal({} as LocationModel);
    locationHandlerStore.isLoading = signal(false);
  }

  const queryParamId = signal('');

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        CharacterComponent,
        NoopAnimationsModule
      ],
      providers: [
        MockProvider(CharactersHandlerStore),
        MockProvider(LocationHandlerStore),
        MockProvider(SnackBarService),
        MockProvider(ActivatedRoute, { snapshot: { queryParamMap: { get(id: string) { return queryParamId(); } } } as any }),
      ],
    });
  });

  beforeEach(() => {
    activatedRoute = TestBed.inject(ActivatedRoute);
    charactersHandlerStore = TestBed.inject(CharactersHandlerStore);
    locationHandlerStore = TestBed.inject(LocationHandlerStore);
    snackBarService = TestBed.inject(SnackBarService);
  });

  describe('setId', () => {
    it(`should update the id`, () => {
      // Arrange
      setSpys();
      spyOn(snackBarService, 'openErrorSnackBar');
      queryParamId.update(() => '12');

      // Act
      createInstance();
      initTest();

      // Assert
      expect(component.id()).toEqual(12);
      expect(snackBarService.openErrorSnackBar).not.toHaveBeenCalled();
    });

    it(`should not update the id and should show an eror`, () => {
      // Arrange
      setSpys();
      spyOn(snackBarService, 'openErrorSnackBar');
      queryParamId.update(() => '');

      // Act
      createInstance();
      initTest();

      // Assert
      expect(component.id()).toBeUndefined();
      expect(snackBarService.openErrorSnackBar).toHaveBeenCalledWith(
        {
          message: TextConstant.character.idMissing,
          actionButtonText: TextConstant.character.snackbarErrorBtn
        }
      );
    });

  });

  describe('loadCharacterById', () => {
    it(`should call the loadCharacterById method`, () => {
      // Arrange
      setSpys();
      spyOn(charactersHandlerStore, 'loadCharacterById');
      createInstance();
      initTest();
      component.id.update(() => 12);

      // Act
      component['loadCharacterById']();

      // Assert
      expect(charactersHandlerStore.loadCharacterById).toHaveBeenCalledWith({ id: 12 });
    });

    it(`should not call the loadCharacterById method`, () => {
      // Arrange
      setSpys();
      spyOn(charactersHandlerStore, 'loadCharacterById');
      createInstance();
      initTest();
      component.id.update(() => undefined);

      // Act
      component['loadCharacterById']();

      // Assert
      expect(charactersHandlerStore.loadCharacterById).not.toHaveBeenCalled();
    });
  });
});
