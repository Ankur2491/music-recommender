import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  searchText = "";
  trackList: Array<any> = [];
  selected='';
  constructor(private http: HttpClient, private _sanitizer: DomSanitizer) { }

  ngOnInit(): void {
  }

  search() {
    if (this.searchText.length > 2) {
      this.http.get(`https://ws.audioscrobbler.com/2.0/?method=track.search&track=${this.searchText}&api_key=7b9b811126f62cd662af3bd98bd57966&format=json`).subscribe(async (data: any)=>{
        let tracks = data.results.trackmatches.track;
        for(let trObj of tracks){
          let obj: any = {'name': trObj.name, 'artist': trObj.artist};
          let url = trObj['url'];
          let trackData: any = await this.http.post(`https://tech-blogs-aggregator-api.vercel.app/mr`,{'url': url}).toPromise();
            obj['url'] = this._sanitizer.bypassSecurityTrustResourceUrl(trackData['url']);
            if(!this.checkDuplicate(obj.name))
              this.trackList.push(obj);
        }
      })
    }
    else if(this.searchText.length<3){
      this.trackList = [];
    }
  }

  checkDuplicate(trackName: string){
    let found = false;
    for(let track of this.trackList){
        if(trackName == track.name){
          found = true;
          break;
        }
    }
    return found;
  }

  showVideo(trackName: any){
    this.selected = trackName;
  }


}
