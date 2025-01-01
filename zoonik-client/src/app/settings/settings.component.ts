import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AppApiService } from '../app-api.service';
import { AsyncPipe, NgForOf } from '@angular/common';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  UntypedFormControl,
  UntypedFormGroup,
  Validators
} from '@angular/forms';
import { SettingsControlsNames, VideoRecord } from './settings.model';
import { BehaviorSubject, concatMap, Subject, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    AsyncPipe,
    NgForOf,
    ReactiveFormsModule
  ],
  templateUrl: './settings.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsComponent {
  private videoApi = inject(AppApiService);
  private uploadFile: File | null = null;
  private updateList$ = new BehaviorSubject<void>(undefined);
  public list$ = this.updateList$.pipe(switchMap(()=>this.videoApi.getVideos()));
  public formGroup = new UntypedFormGroup({
    [SettingsControlsNames.id]: new UntypedFormControl(null, Validators.required),
    [SettingsControlsNames.name]: new UntypedFormControl(null, Validators.required),
    [SettingsControlsNames.isActive]: new UntypedFormControl(true),
    [SettingsControlsNames.description]: new UntypedFormControl(null),
    [SettingsControlsNames.originalName]: new UntypedFormControl(null),
    [SettingsControlsNames.url]: new UntypedFormControl(null),
  })
  protected readonly settingsControlsNames = SettingsControlsNames;

  public onFileSelected(event:any ): void {
    this.uploadFile = event.target.files[0];
  }

  public save(): void {
    if(!this.uploadFile) return;

    this.videoApi.uploadVideo(this.uploadFile).pipe(
      switchMap( ({url, originalName})=> this.videoApi.createVideo({
        ...this.formGroup.value,
        url,
        originalName
      }))
    ).subscribe(()=>this.updateList$.next())
  }

  public delete(id?:number): void {
    if(!id) return;

    this.videoApi.deleteVideo(id).subscribe(()=>this.updateList$.next());
  }
}
