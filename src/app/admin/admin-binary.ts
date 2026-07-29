import { Component, ChangeDetectionStrategy, inject, signal, effect, OnDestroy } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Subject, Subscription, debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { AdminBinaryService, UserSearchResult } from './admin-binary.service';

@Component({
  selector: 'app-admin-binary',
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './admin-binary.html'
})
export class AdminBinaryComponent implements OnDestroy {
  private readonly binaryService = inject(AdminBinaryService);

  protected readonly sponsorSearch = signal('');
  protected readonly newUserSearch = signal('');
  protected readonly sponsorResults = signal<UserSearchResult[]>([]);
  protected readonly newUserResults = signal<UserSearchResult[]>([]);
  protected readonly selectedSponsor = signal<UserSearchResult | null>(null);
  protected readonly selectedNewUser = signal<UserSearchResult | null>(null);
  protected readonly showSponsorResults = signal(false);
  protected readonly showNewUserResults = signal(false);

  protected readonly position = signal<'Left' | 'Right'>('Left');
  protected readonly message = signal('');
  protected readonly isError = signal(false);
  protected readonly loading = signal(false);

  private readonly sponsorSearch$ = new Subject<string>();
  private readonly newUserSearch$ = new Subject<string>();
  private readonly subs: Subscription[] = [];

  constructor() {
    this.subs.push(
      this.sponsorSearch$.pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((q) => this.binaryService.searchUsers(q))
      ).subscribe((r) => {
        this.sponsorResults.set(r);
        this.showSponsorResults.set(true);
      })
    );

    this.subs.push(
      this.newUserSearch$.pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((q) => this.binaryService.searchUsers(q))
      ).subscribe((r) => {
        this.newUserResults.set(r);
        this.showNewUserResults.set(true);
      })
    );
  }

  protected onSponsorInput(value: string): void {
    this.selectedSponsor.set(null);
    this.sponsorSearch.set(value);
    if (value.trim().length >= 2) {
      this.sponsorSearch$.next(value.trim());
    } else {
      this.sponsorResults.set([]);
    }
  }

  protected onNewUserInput(value: string): void {
    this.selectedNewUser.set(null);
    this.newUserSearch.set(value);
    if (value.trim().length >= 2) {
      this.newUserSearch$.next(value.trim());
    } else {
      this.newUserResults.set([]);
    }
  }

  protected selectSponsor(user: UserSearchResult): void {
    this.selectedSponsor.set(user);
    this.sponsorSearch.set(`${user.firstName} ${user.lastName} (${user.userName ?? user.email})`);
    this.sponsorResults.set([]);
    this.showSponsorResults.set(false);
  }

  protected selectNewUser(user: UserSearchResult): void {
    this.selectedNewUser.set(user);
    this.newUserSearch.set(`${user.firstName} ${user.lastName} (${user.userName ?? user.email})`);
    this.newUserResults.set([]);
    this.showNewUserResults.set(false);
  }

  protected hideSponsorResults(): void {
    setTimeout(() => this.showSponsorResults.set(false), 200);
  }

  protected hideNewUserResults(): void {
    setTimeout(() => this.showNewUserResults.set(false), 200);
  }

  protected clearSponsor(): void {
    this.selectedSponsor.set(null);
    this.sponsorSearch.set('');
    this.sponsorResults.set([]);
  }

  protected clearNewUser(): void {
    this.selectedNewUser.set(null);
    this.newUserSearch.set('');
    this.newUserResults.set([]);
  }

  protected place(): void {
    const sponsor = this.selectedSponsor();
    const newUser = this.selectedNewUser();
    const position = this.position();

    if (!sponsor) {
      this.isError.set(true);
      this.message.set('Please select a sponsor user from the search results.');
      return;
    }

    if (!newUser) {
      this.isError.set(true);
      this.message.set('Please select a new member from the search results.');
      return;
    }

    this.loading.set(true);
    this.message.set('');

    this.binaryService.placeMember(sponsor.id, newUser.id, position).subscribe({
      next: () => {
        this.loading.set(false);
        this.isError.set(false);
        this.message.set(`${newUser.firstName} ${newUser.lastName} placed as ${position} child of ${sponsor.firstName} ${sponsor.lastName}.`);
        this.clearSponsor();
        this.clearNewUser();
      },
      error: (err: unknown) => {
        this.loading.set(false);
        this.isError.set(true);
        this.message.set(this.handleError(err, 'Unable to place member.'));
      }
    });
  }

  private handleError(err: unknown, fallback: string): string {
    if (err instanceof HttpErrorResponse) {
      console.error('[AdminBinary]', fallback, err);
      return typeof err.error === 'string' ? err.error : `HTTP ${err.status}: ${fallback}`;
    }
    return fallback;
  }

  ngOnDestroy(): void {
    for (const sub of this.subs) sub.unsubscribe();
  }
}
