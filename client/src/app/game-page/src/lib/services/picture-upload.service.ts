import {inject, Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../../../environments/environment";
import {Observable} from "rxjs";

@Injectable()
export class PictureUploadService {
  private http: HttpClient = inject(HttpClient)
  private baseUrl: string = environment.apiUrl;

  saveImage(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/trip/image`, formData);
  }

}
