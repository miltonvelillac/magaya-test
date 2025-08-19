import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EpisodesComponent } from './episodes.component';
import { MockProvider } from 'ng-mocks';
import { EpisodesHandlerStore } from '@core/state/episodes/handler/episodes-handler.store';
import { EpisodeHelperService } from '@core/services/episode-helper/episode-helper.service';
import { signal } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';

describe('EpisodesComponent', () => {
  let component: EpisodesComponent;
  let fixture: ComponentFixture<EpisodesComponent>;

  let episodesHandlerStore: EpisodesHandlerStore;
  let episodeHelperService: EpisodeHelperService;

  const initData = () => {
    episodeHelperService.episodes = signal([]);
    episodeHelperService.episodesLoading = signal(false);
    episodeHelperService.episodesErrror = signal({});
    episodeHelperService.characters = signal([]);
    episodeHelperService.charactersLoading = signal(false);
    episodeHelperService.charactersErrror = signal({});

    episodeHelperService.emptyDataMessage = signal('');
    episodeHelperService.pageIndex = signal(0);
    episodeHelperService.pageSize = signal(0);
    episodeHelperService.pageLength = signal(0);
    episodeHelperService.displayedColumns = ['id'] as any;

    episodeHelperService.charactersData = signal([]);
    episodeHelperService.isLoading = signal(false);

    episodesHandlerStore.allEpisodes = signal([]);
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EpisodesComponent],
      providers: [
        provideAnimations(),
        MockProvider(EpisodesHandlerStore),
        MockProvider(EpisodeHelperService),
      ]
    })
      .compileComponents();

    episodesHandlerStore = TestBed.inject(EpisodesHandlerStore);
    episodeHelperService = TestBed.inject(EpisodeHelperService);
    initData();

    fixture = TestBed.createComponent(EpisodesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
