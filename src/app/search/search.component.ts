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
  selected = '';
  mainSub: any;
  childSub: any;
  constructor(private http: HttpClient, private _sanitizer: DomSanitizer) { }

  ngOnInit(): void {
  }

  search() {
    this.trackList = [];
    if(this.mainSub && this.childSub){
    this.mainSub.unsubscribe;
    this.childSub.unsubscribe;
    }
    if (this.searchText.length > 2) {
      this.mainSub = this.http.get(`https://ws.audioscrobbler.com/2.0/?method=track.search&track=${this.searchText}&api_key=7b9b811126f62cd662af3bd98bd57966&format=json`).subscribe((data: any) => {
        let tracks = data.results.trackmatches.track;
        for (let trObj of tracks) {
          let obj: any = { 'name': trObj.name, 'artist': trObj.artist };
          let url = trObj['url'];
          this.childSub = this.http.post(`https://tech-blogs-aggregator-api.vercel.app/mr`, { 'url': url })
          .subscribe((trackData: any)=>{
            obj['url'] = this._sanitizer.bypassSecurityTrustResourceUrl(trackData['url']);
            if (!this.checkDuplicate(obj.name))
              this.trackList.push(obj);
          })
        }
      });

    }
  }

  checkDuplicate(trackName: string) {
    let found = false;
    for (let track of this.trackList) {
      if (trackName == track.name) {
        found = true;
        break;
      }
    }
    return found;
  }

  showVideo(trackName: any) {
    this.selected = trackName;
  }


}
