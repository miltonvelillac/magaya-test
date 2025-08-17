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
import { NavigationServiceTsService } from '@core/services/navigation/navigation.service.ts.service';

describe('CharacterComponent', () => {
  let component: CharacterComponent;
  let fixture: ComponentFixture<CharacterComponent>;

  let activatedRoute: ActivatedRoute;
  let charactersHandlerStore: CharactersHandlerStore;
  let locationHandlerStore: LocationHandlerStore;
  let navigationServiceTsService: NavigationServiceTsService;
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
        MockProvider(NavigationServiceTsService),
        MockProvider(ActivatedRoute, { snapshot: { queryParamMap: { get(id: string) { return queryParamId(); } } } as any }),
      ],
    });
  });

  beforeEach(() => {
    activatedRoute = TestBed.inject(ActivatedRoute);
    charactersHandlerStore = TestBed.inject(CharactersHandlerStore);
    locationHandlerStore = TestBed.inject(LocationHandlerStore);
    navigationServiceTsService = TestBed.inject(NavigationServiceTsService);
    snackBarService = TestBed.inject(SnackBarService);
  });

  describe('getDisableBackBtn', () => {
    it(`should disable the back button when the id is 1`, () => {
      // Arrange
      setSpys();
      createInstance();
      initTest();

      // Act
      component.id.update(() => 1);
      const disableBtn = component.getDisableBackBtn();

      // Assert
      expect(disableBtn).toBeTrue();
    });

    it(`should disable the back button when the id lower than 1`, () => {
      // Arrange
      setSpys();
      createInstance();
      initTest();

      // Act
      component.id.update(() => 0);
      const disableBtn = component.getDisableBackBtn();

      // Assert
      expect(disableBtn).toBeTrue();
    });

    it(`should not disable the back button when the id grater than 1`, () => {
      // Arrange
      setSpys();
      createInstance();
      initTest();

      // Act
      component.id.update(() => 2);
      const disableBtn = component.getDisableBackBtn();

      // Assert
      expect(disableBtn).toBeFalse();
    });
  });

  describe('goBack', () => {
    it(`should call the method to navigate when the back button is enable`, () => {
      // Arrange
      setSpys();
      createInstance();
      initTest();
      spyOn(component, 'getDisableBackBtn').and.returnValue(false);
      spyOn<any>(component, 'navigateTo');
      component.id.update(() => 2);
      
      // Act
      component.goBack();

      // Assert
      expect(component['navigateTo']).toHaveBeenCalledWith({ id: 1 });
    });
  
    it(`should not call the method to navigate when the button is disabled`, () => {
      // Arrange
      setSpys();
      createInstance();
      initTest();
      spyOn(component, 'getDisableBackBtn').and.returnValue(true);
      spyOn<any>(component, 'navigateTo');
      component.id.update(() => 2);
      
      // Act
      component.goBack();

      // Assert
      expect(component['navigateTo']).not.toHaveBeenCalled();
    });
  });

  describe('goNext', () => {
    it(`should call the method to navigate with the next character id`, () => {
      // Arrange
      setSpys();
      createInstance();
      initTest();
      spyOn<any>(component, 'navigateTo');
      component.id.update(() => 2);
      
      // Act
      component.goNext();

      // Assert
      expect(component['navigateTo']).toHaveBeenCalledWith({ id: 3 });
    });
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
  });
});
