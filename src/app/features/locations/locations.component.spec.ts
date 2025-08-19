import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationsComponent } from './locations.component';
import { MockProvider } from 'ng-mocks';
import { LocationHandlerStore } from '@core/state/location/handler/location-handler.store';
import { LocationHelperService } from '@core/services/location-helper/location-helper.service';
import { signal } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';

describe('LocationsComponent', () => {
  let component: LocationsComponent;
  let fixture: ComponentFixture<LocationsComponent>;

  let locationHandlerStore: LocationHandlerStore;
  let locationHelperService: LocationHelperService;

  const initValues = () => {
    locationHelperService.locations = signal([]);
    locationHelperService.allLocations = signal([]);
    locationHelperService.locationLoading = signal(false);
    locationHelperService.locationErrror = signal({});
    locationHelperService.characters = signal([]);
    locationHelperService.charactersLoading = signal(false);
    locationHelperService.charactersErrror = signal({});

    locationHelperService.emptyDataMessage = signal('');
    locationHelperService.pageIndex = signal(0);
    locationHelperService.pageSize = signal(10);
    locationHelperService.pageLength = signal(10);
    locationHelperService.displayedColumns = ['id', 'name', 'status', 'species', 'gender'];

    locationHelperService.charactersData = signal([]);
    locationHelperService.isLoading = signal(false);

    locationHandlerStore.allLocations = signal([]);
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LocationsComponent],
      providers: [
        provideAnimations(),
        MockProvider(LocationHandlerStore),
        MockProvider(LocationHelperService),
      ]
    })
      .compileComponents();

    locationHandlerStore = TestBed.inject(LocationHandlerStore);
    locationHelperService = TestBed.inject(LocationHelperService);

    initValues();
    fixture = TestBed.createComponent(LocationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
