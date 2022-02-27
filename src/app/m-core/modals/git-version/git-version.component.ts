import { Component, OnInit, Input, Output,ViewChild,EventEmitter, HostListener } from '@angular/core';
import { CommonFunctionService } from '../../../services/common-utils/common-function.service';
import { ModalDirective } from 'angular-bootstrap-md';
import { ModelService } from 'src/app/services/model/model.service';
import { ApiService } from '../../../services/api/api.service';
import { DataShareService } from '../../../services/data-share/data-share.service';

@Component({
  selector: 'app-git-version',
  template: `
  <div mdbModal #basicModal="mdbModal" class="modal fade">
  <div class="modal-dialog gitversionmodel">
    <div class="modal-content">
      <div class="modal-header border-0 m-0">
        <h4 class="modal-title font-weight-bold m-0">Information</h4>
        <button (click)="basicModal.hide()" class="closebtb"><span>&times;</span></button>
      </div>
      <div class="modal-body p-1">
        <div class="table-responsive table">
          <table class="table w-100">
            <tbody>
              <tr><td style="width:160px;display:block;"><strong>Version</strong></td><td><strong>{{gitVersion}}</strong></td></tr>
              <tr><td><strong>Branch</strong></td><td><strong>{{gitbranch}}</strong></td></tr>
              <tr><td><strong>Build Host</strong></td><td><strong>{{gitbuild}}</strong></td></tr>
              <tr><td><strong>Build Number</strong></td><td><strong>{{gitnumber}}</strong></td></tr>
              <tr><td><strong>Build Number Unique</strong></td><td><strong>{{gitunique}}</strong></td></tr>
              <tr><td><strong>Build Time</strong></td><td><strong>{{gittime}}</strong></td></tr>
              <tr><td><strong>Build User Email</strong></td><td><strong>{{gitemail}}</strong></td></tr>
              <tr><td><strong>Build User Name</strong></td><td><strong>{{gitname}}</strong></td></tr>
              <tr><td><strong>Closest Tag Commit Count</strong></td><td><strong>{{gitcount}}</strong></td></tr>
              <tr><td><strong>Closest Tag Name</strong></td><td><strong>{{gitTagName}}</strong></td></tr>
              <tr><td><strong>Commit Id</strong></td><td><strong>{{gitId}}</strong></td></tr>
              <tr><td><strong>Commit Id Abbrev</strong></td><td><strong>{{gitAbbrev}}</strong></td></tr>
              <tr><td><strong>Commit Id Describe</strong></td><td><strong>{{gitdescribe}}</strong></td></tr>
              <tr><td><strong>Commit Id Describe-short</strong></td><td><strong>{{gitDescribeShort}}</strong></td></tr>
              <tr><td><strong>Commit Message Full</strong></td><td><strong>{{gitmessage}}</strong></td></tr>
              <tr><td><strong>Commit Message Short</strong></td><td><strong>{{gitSortMsg}}</strong></td></tr>
              <tr><td><strong>Commit Time</strong></td><td><strong>{{gitCommitTime}}</strong></td></tr>
              <tr><td><strong>Commit User Email</strong></td><td><strong>{{gitCommitEmail}}</strong></td></tr>
              <tr><td><strong>Commit User Name</strong></td><td><strong>{{gitCommitUser}}</strong></td></tr>
              <tr><td><strong>Dirty</strong></td><td><strong>{{gitdirty}}</strong></td></tr>
              <tr><td><strong>Local Branch Ahead</strong></td><td><strong>{{gitahead}}</strong></td></tr>
              <tr><td><strong>local Branch Behind</strong></td><td><strong>{{gitbehind}}</strong></td></tr>
              <tr><td><strong>Remote Origin Url</strong></td><td><strong>{{gitOriginUrl}}</strong></td></tr>
              <tr><td><strong>Tags</strong></td><td><strong>{{gittags}}</strong></td></tr>
              <tr><td><strong>Total Commit Count</strong></td><td><strong>{{gitCommitCount}}</strong></td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</div>
  `,
  styles: [
  ]
})
export class GitVersionComponent implements OnInit {

  @Output() shortcutinfoResponce = new EventEmitter();
  @Input() id: string;
  @ViewChild('basicModal') public basicModal: ModalDirective;


  gitVersionSubscription:any;
  gitVersion: any;
  gitbranch: any;
  gitbuild: any;
  gitnumber: any;
  gitunique: any;
  gittime: any;
  gitemail: any;
  gitname: any;
  gitcount: any;
  gitTagName: any;
  gitId: any;
  gitAbbrev: any;
  gitdescribe: any;
  gitDescribeShort: any;
  gitmessage: any;
  gitSortMsg: any;
  gitCommitTime: any;
  gitCommitEmail: any;
  gitCommitUser: any;
  gitdirty: any;
  gitahead: any;
  gitbehind: any;
  gitOriginUrl: any;
  gittags: any;
  gitCommitCount: any;




  constructor(
    private commonFunctionService:CommonFunctionService,
    private modalService: ModelService,
    private apiService:ApiService,
    private dataShareService:DataShareService,
    ) {
    this.gitVersionSubscription = this.dataShareService.gitVirsion.subscribe( data =>{
      if(data && data['git.build.version']){
        this.gitVersion = data['git.build.version'];
      }
      if(data && data['git.branch']){
        this.gitbranch = data['git.branch'];
      }
      if(data && data['git.build.host']){
        this.gitbuild = data['git.build.host'];
      }
      if(data && data['git.build.number']){
        this.gitnumber = data['git.build.number'];
      }
      if(data && data['git.build.number.unique']){
        this.gitunique = data['git.build.number.unique'];
      }
      if(data && data['git.build.time']){
        this.gittime = data['git.build.time'];
      }
      if(data && data['git.build.user.email']){
        this.gitemail = data['git.build.user.email'];
      }
      if(data && data['git.build.user.name']){
        this.gitname = data['git.build.user.name'];
      }
      if(data && data['git.closest.tag.commit.count']){
        this.gitcount = data['git.closest.tag.commit.count'];
      }
      if(data && data['git.closest.tag.name']){
        this.gitTagName = data['git.closest.tag.name'];
      }
      if(data && data['git.commit.id']){
        this.gitId = data['git.commit.id'];
      }
      if(data && data['git.commit.id.abbrev']){
        this.gitAbbrev = data['git.commit.id.abbrev'];
      }
      if(data && data['git.commit.id.describe']){
        this.gitdescribe = data['git.commit.id.describe'];
      }
      if(data && data['git.commit.id.describe-short']){
        this.gitDescribeShort = data['git.commit.id.describe-short'];
      }
      if(data && data['git.commit.message.full']){
        this.gitmessage = data['git.commit.message.full'];
      }
      if(data && data['git.commit.message.short']){
        this.gitSortMsg = data['git.commit.message.short'];
      }
      if(data && data['git.commit.time']){
        this.gitCommitTime = data['git.commit.time'];
      }
      if(data && data['git.commit.user.email']){
        this.gitCommitEmail = data['git.commit.user.email'];
      }
      if(data && data['git.commit.user.name']){
        this.gitCommitUser = data['git.commit.user.name'];
      }
      if(data && data['git.dirty']){
        this.gitdirty = data['git.dirty'];
      }
      if(data && data['git.local.branch.ahead']){
        this.gitahead = data['git.local.branch.ahead'];
      }
      if(data && data['git.local.branch.behind']){
        this.gitbehind = data['git.local.branch.behind'];
      }
      if(data && data['git.remote.origin.url']){
        this.gitOriginUrl = data['git.remote.origin.url'];
      }
      if(data && data['git.tags']){
        this.gittags = data['git.tags'];
      }
      if(data && data['git.total.commit.count']){
        this.gitCommitCount = data['git.total.commit.count'];
      }

    })
  }


  @HostListener('window:keyup.alt.c') onCtrC(){
    this.close();
}


  ngOnInit(): void {
    let modal = this;
    if (!this.id) {
        console.error('modal must have an id');
        return;
    }
    this.modalService.remove(this.id);
    this.modalService.add(this);
  }


  showModal(object){ 
    this.basicModal.show();
  }
  close(){
    this.basicModal.hide();
  }


}
