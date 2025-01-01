import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { AsyncPipe, NgForOf } from '@angular/common';
import { BehaviorSubject, concatMap, delay, from, map, zip } from 'rxjs';
import { AppApiService } from '../app-api.service';
import { BASE_URL } from '../app.config';

@Component({
  selector: 'app-video-player',
  standalone: true,
  imports: [
    NgForOf,
    AsyncPipe
  ],
  templateUrl: './video-player.component.html',
})
export class VideoPlayerComponent implements OnInit{
  private videoApi = inject(AppApiService);
  @ViewChild('videoPlayer') videoPlayer!: ElementRef<HTMLVideoElement>;
  public movies$ = this.videoApi.getVideos();
  public videoEnded$ = new BehaviorSubject<void>(undefined);

  currentVideoUrl = 'http://localhost:3000/videos/sample2.mp4';


  ngOnInit() {
    const movieUrls$ = this.movies$.pipe(
      delay(100),
      concatMap( (movies)=> from(movies)),
      map(({url})=> BASE_URL + url),
    )


    zip(movieUrls$, this.videoEnded$).subscribe(
      ([url])=>this.play(url)
    )
  }

  public play(url:string):void{
    console.log({ url });
    const videoPlayer = this.videoPlayer.nativeElement;

    this.currentVideoUrl = BASE_URL + url;
    console.log(this.currentVideoUrl );
    videoPlayer.load();
    videoPlayer.play();
  }
}
