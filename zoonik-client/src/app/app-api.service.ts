import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { VideoRecord } from './settings/settings.model';
import { BASE_URL } from './app.config';

@Injectable({providedIn: 'root'})
export class AppApiService {
  constructor(private http: HttpClient) {}

  public uploadVideo(file: File):Observable<{url:string, originalName:string}> {
    const formData = new FormData();
    formData.append('video', file);
    return this.http.post<{url:string, originalName:string}>(`${BASE_URL}/upload`, formData);
  }

  public getVideos():Observable<VideoRecord[]> {
    return this.http.get<VideoRecord[]>(`${BASE_URL}/videos`);
  }
  public createVideo(videoRecord:VideoRecord):Observable<{ id: number }>{
    return this.http.post<{ id: number }>(`${BASE_URL}/save-video`, videoRecord);
  }
  public deleteVideo(id:number):Observable<unknown>{
    return this.http.delete(`${BASE_URL}/video/${id}`);
  }
}
