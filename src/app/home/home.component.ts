import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SafePipe } from '../safePipe';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  trackList: Array<any> = [];

  constructor(private http: HttpClient, private safePipe: SafePipe, private _sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.http.get(`https://ws.audioscrobbler.com/2.0/?method=chart.gettoptracks&api_key=7b9b811126f62cd662af3bd98bd57966&format=json`).subscribe((data: any)=>{
      let tracks = data.tracks.track;
      for(let trObj of tracks){
        let obj: any = {'name': trObj.name, 'playcount': trObj.playcount, 'artist': trObj.artist.name};
        let url = trObj['url'];
        this.http.post(`https://tech-blogs-aggregator-api.vercel.app/mr`,{'url': url}).subscribe((trackData: any)=>{
          obj['url'] = this._sanitizer.bypassSecurityTrustResourceUrl(trackData['url']);
          this.trackList.push(obj);
          console.log(this.trackList);
        })
      }
    })
  }

}
