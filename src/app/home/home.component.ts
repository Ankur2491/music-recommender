import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  trackList: Array<any> = [];
  selected='';

  constructor(private http: HttpClient, private _sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.http.get(`https://ws.audioscrobbler.com/2.0/?method=chart.gettoptracks&api_key=7b9b811126f62cd662af3bd98bd57966&format=json`).subscribe(async (data: any)=>{
      let tracks = data.tracks.track;
      for(let trObj of tracks){
        let obj: any = {'name': trObj.name, 'playcount': trObj.playcount, 'artist': trObj.artist.name};
        let url = trObj['url'];
        let trackData: any = await this.http.post(`https://tech-blogs-aggregator-api.vercel.app/mr`,{'url': url}).toPromise();
          obj['url'] = this._sanitizer.bypassSecurityTrustResourceUrl(trackData['url']);
          this.trackList.push(obj);
      }
    })
  }
  sortTracks(){
    this.trackList.sort((a,b)=>{return (Number(b['playcount']) - Number(a['playcount']))})
  }
  showVideo(trackName: any){
    this.selected = trackName;
  }

}
