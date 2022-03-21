import { Component, OnInit, ViewChild, Input, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { StorageService } from '../../../services/storage/storage.service';
import { ContextMenuComponent } from 'ngx-contextmenu';
import { DocApiService } from '../../../services/api/doc-api/doc-api.service';
import { DocDataShareService } from '../../../services/data-share/doc-data-share/doc-data-share.service';
import { ModelService } from '../../../services/model/model.service';
import { EnvService } from '../../../services/env/env.service';
import { NotificationService } from 'src/app/services/notify/notification.service';

@Component({
  selector: 'lib-drive-home',
  templateUrl: './drive-home.component.html',
  styleUrls: ['./drive-home.component.css']
})
export class DriveHomeComponent implements OnInit {

  public title: any = 'Right Click Me';
	public DocIndex: any;
	public thisContext: any = this;
	public itemVisible: any = false;
	public documentViewList: boolean = true;
	public docDetailActivity: boolean = false;
	public uploadFile: boolean = false;
	public selectedRowFile: any = false;
	public files: any[] = [];
	public selectionAny: any = false;
	public selectedRow: any = -1;
	public fileSelectRow: any = -1;
	public folders: any = [];
	public filess: any = [];
	public docfiless: any = [];
	SearchDocument: any;
	searchText: string;
	searchDocumentFiles: any = [];
	searchDocumentFolders: any = [];
	public trashfiless: any[];
	public datas: any[];
	public rowdata: any;
	public fileType: any;
	public fileSize: any;
	public owner: any;
	public mfdDate: any;
	userInfo: any;
	public filename: any;
	public extIcon: any = '';
	public QuickAccess: boolean = false;
	vdrParantData: any = {};
	public newFolder: any = {};
	public folderChilds: any = [];
	public folderName: any = "";
	public childFolders: any = [];
	public childFiles: any = [];
	public qucikAccess: boolean = true;

	public fileDrop: boolean;

	public openFolderData: any;
	public selecteDelteFileName: any = '';
	docFolderPerms: any = {};
	docFilePerms: any = {};
	auditPerms: any = {};
	docDetailPerms: any = {};
	public downloadLink: any;
	public showNewFolderAndUploadDropdown: boolean = false;
	public movefolderName: any = '';
	public partyUserData: any;
	public permissionListData: any;
	public permissionOptions: any;
	public permissionPlaceholder: any;
	name = 'Angular';
	public pathList: any = [];
    public folderKey: any = '';
    private documentSubscription;
    private vdrDataSubscription;
    private moveFolderDataSubscription;
    private moveFolderChildDataSubscription;
    private docFileUploadResponceSubscription;
    private docFileDownloadSubscription;
    private docFileViewSubscription;
    private docDeleteSubscription;
	private docFoderSubscription;
	hidehome = false;
	@ViewChild(ContextMenuComponent) public basicMenu: ContextMenuComponent;
	

	constructor(
        private http: HttpClient, 
        private storageService: StorageService, 
        private docApiService:DocApiService,
		private docDataShareService:DocDataShareService,
		private modelService:ModelService,
		private envService:EnvService,
		private notificationService:NotificationService
    ) {
		this.documentSubscription = this.docDataShareService.docData.subscribe(doc =>{
            this.setDocData(doc);
        })
        this.vdrDataSubscription = this.docDataShareService.vdrData.subscribe(vdr =>{
            this.setVdrData(vdr);
        })
        this.moveFolderDataSubscription = this.docDataShareService.moveFolderData.subscribe(moveData =>{
            this.setMoveFolderData(moveData);
        })
        this.moveFolderChildDataSubscription = this.docDataShareService.moveFolderChild.subscribe(moveChildData =>{
            this.setMoveFolderChildData(moveChildData);
        })
        this.docFileUploadResponceSubscription = this.docDataShareService.uploadResponce.subscribe(responce =>{
            this.setDocUploadResponce(responce);
        })
        this.docFileDownloadSubscription = this.docDataShareService.docFiledownloadLink.subscribe(link =>{
            this.docFileDownload(link);
        })
        this.docFileViewSubscription = this.docDataShareService.docFileViewLink.subscribe(link =>{
            this.docFileView(link);
        })
        this.docDeleteSubscription = this.docDataShareService.docDeleteResponce.subscribe(del =>{
            this.docDelete(del);
        })
		this.docFoderSubscription = this.docDataShareService.folder.subscribe(data => {
			this.setFolder(data);
		})
		this.userInfo = this.storageService.GetUserInfo();
		this.rootDataCall();
		
	}

    ngOnDestroy(): void {
        //Called once, before the instance is destroyed.
        //Add 'implements OnDestroy' to the class.
        if(this.documentSubscription){
            this.documentSubscription.unsubscribe();
        }
        if(this.vdrDataSubscription){
            this.vdrDataSubscription.unsubscribe();
        }
        if(this.moveFolderDataSubscription){
            this.moveFolderDataSubscription.unsubscribe();
        }
        if(this.moveFolderChildDataSubscription){
            this.moveFolderChildDataSubscription.unsubscribe();
        }
        if(this.docFileUploadResponceSubscription){
            this.docFileUploadResponceSubscription.unsubscribe();
        }
        if(this.docFileDownloadSubscription){
            this.docFileDownloadSubscription.unsubscribe();
        }
        if(this.docFileViewSubscription){
            this.docFileViewSubscription.unsubscribe();
        }
        if(this.docDeleteSubscription){
            this.docDeleteSubscription.unsubscribe();
        }
    }
	ngOnInit() {
		this.permissionListData = [];
		this.permissionPlaceholder = "Add people & groups";
		this.permissionOptions = { multiple: true };

	}

    setDocData(searchDocData){
        if (searchDocData && searchDocData.length > 0) {
            this.SearchDocument = searchDocData;
            this.searchDocumentFolders = [];
            this.searchDocumentFiles = [];
            this.SearchDocument.forEach(element => {
                if (element.folder) {
                    this.searchDocumentFolders.push(element);
                } else {
                    this.searchDocumentFiles.push(element);
                }
            });
            // this.searchText = searchText;
            // this.showQuickAccess();
        }
        else {
            this.SearchDocument = [];
            this.searchDocumentFolders = [];
            this.searchDocumentFiles = [];
        }
    }
    setVdrData(vdrData){
        if (vdrData && vdrData.length > 0) {
            this.childFolders = [];
            this.childFiles = [];
            this.vdrParantData = vdrData;
            this.vdrParantData.forEach(element => {
                if (element.folder) {
                    this.childFolders.push(element);
                } else {
                    this.childFiles.push(element);
                }
            });
            this.getPathList();

        } else {
            this.childFolders = [];
            this.childFiles = [];
        }
    }
	setFolder(folder){
		if(folder && folder._id){
			this.vdrprentfolder = folder;
			this.showNewFolderAndUploadDropdown = true;
		}
	}
    setMoveFolderData(moveFolderData){
        if (moveFolderData && moveFolderData.length > 0) {
            this.moveFolderChildren = [];
            moveFolderData.forEach(element => {
                if (element.folder) {
                    this.moveFolderChildren.push(element);
                }
            });
        }
    }
    setMoveFolderChildData(moveFolderChild){
        if (moveFolderChild.length > 0 && !this.firstTimeOpenMoveModel) {
            this.moveFolderChildren = [];
            var data = moveFolderChild
            data.forEach(element => {
                if (element.folder) {
                    this.moveFolderChildren.push(element)
                }
            });
        }
    }
    setDocUploadResponce(uploadResponce){
        if (uploadResponce && this.uploadData.length > 0) {
            this.notificationService.notify("bg-success", "Upload successfully");
            this.docApiService.GetFolderChild(this.openFolderData);
			//this.closeDocView('#fileUploadWithDragDrop');
			this.modelService.close('docFileUpload')
            this.uploadFile = false;
            this.uploadData = [];
            this.files = [];
        }
    }
	setPermDropDown(permList) {
		if (permList && permList.length > 0) {
			this.permissionListData = [];
			permList.forEach(element => {
				let Obj = {
					id: element._id,
					text: element.name,
				}
				this.permissionListData.push(Obj);
			});

			console.log(this.permissionListData);
		}
	}
    docFileDownload(downloadLink){
        if (downloadLink != '' && this.downloadClick != '') {
            this.downloadLink = downloadLink;
            //window.open(this.downloadLink,'Download');
            let link = document.createElement('a');
            link.setAttribute('type', 'hidden');
            link.href = this.downloadLink;
            link.download = this.downloadClick;
            document.body.appendChild(link);
            link.click();
            link.remove();
            this.downloadClick = '';
            this.docApiService.ResetDownloadLink();
        }
    }
    docFileView(viewLink){
        if (viewLink != '' && this.viewFileName != '') {
			this.viewLinkOfFile = 'data:image/jpeg;base64,' + viewLink;
			const object = {
				viewLinkOfFile:this.viewLinkOfFile,
				"fileType":this.viewFileType,
				"viewFileName" : this.viewFileName
			}
			this.modelService.open('docViewModal',object);
            //$('#docViewModal').modal('show');
            this.viewFileName = '';
        } 
    }
    docDelete(deletedDocResp){
        if (deletedDocResp != null) {
            if (this.renameText != '') {
                if (deletedDocResp.success == "renamed") {                    
					this.notificationService.notify("bg-success", this.renameText + " Renamed successfully");
					this.modelService.close('createNewfolder');
                }else if (deletedDocResp.error) {                    
					this.notificationService.notify("bg-danger", deletedDocResp.error);
					this.modelService.close('createNewfolder');
                } else {                    
					this.notificationService.notify("bg-danger", "Renamed Failed !!!");
					this.modelService.close('createNewfolder');
                }
                this.renameText = '';
                this.docApiService.GetFolderChild(this.openFolderData)
            }
            if (this.selecteDelteFileName != '') {
                if (deletedDocResp.success == "deleted") {
                    this.notificationService.notify("bg-success", this.selecteDelteFileName + " Deleted successfully");
                }else if (deletedDocResp.error) {                    
					this.notificationService.notify("bg-danger", deletedDocResp.error);
                }  else {
                    this.notificationService.notify("bg-danger", this.selecteDelteFileName + " Deleted Failed !!!");
                }
                this.selecteDelteFileName = '';
                this.docApiService.GetFolderChild(this.openFolderData)
            }
            if (this.movefolderName != '') {                
                if (deletedDocResp.success == "moved") {
                    this.openFolder(this.selectedMoveFolder, null);
                    this.notificationService.notify("bg-success", "Moved successfully");
                }else if (deletedDocResp.error) {                    
					this.notificationService.notify("bg-danger", deletedDocResp.error);
                }  else {
                    this.notificationService.notify("bg-danger", "Moved Failed !!!");
				}
				this.moveModalClose()
                this.movefolderName = '';
                this.docApiService.GetFolderChild(this.openFolderData)
            }
            this.docApiService.ResetDeleteDocResponce();

        }
    }
	public selectedPermissionList: any;

	setSelectPermissionList(data: any): void {
		this.selectedPermissionList = [];
		if (data && data.length > 0) {
			data.forEach(element => {
				const permissionIndex = this.partyUserData.findIndex(role => role._id === element);
				if (permissionIndex > -1) {
					this.selectedPermissionList.push({
						user_id: this.partyUserData[permissionIndex]._id,
						email: this.partyUserData[permissionIndex].email,
						userId: this.partyUserData[permissionIndex].name,
					})
				}
			});
		}
	}

	getHome() {
		this.qucikAccess = true;
		this.childFolders = [];
		this.childFiles = [];
		this.selectedRow = -1;
		this.fileSelectRow = -1;
		this.selectionAny = false;
		this.selectedRowFile = false;
		this.vdrprentfolder = [];
		this.pathList = [];
		this.currentSelectedPath = '';
		this.pathKey = '';
		this.showNewFolderAndUploadDropdown = false;
		this.rootDataCall();
	}
	rootDataCall(action?){
		var clone = Object.assign({}, this.storageService.getUserLog())
		const payload = {
			"appId":this.storageService.getUserAppId(),
			"refCode":this.storageService.getRefCode(),
			"log":clone
		}	
		if(action == "back"){
			this.docApiService.GetHomeVdrBack(payload);
		}else{
			this.docApiService.GetHomeVdr(payload);
		}        
	}
	public currentSelectedPath: any = '';
	getPathList() {
		this.currentSelectedPath = '';
		if (this.vdrprentfolder.key != null) {
			this.folderKey = this.vdrprentfolder.key
			this.pathList = this.folderKey.split("/");
			const startIndex = this.pathList.length - 2;
			this.currentSelectedPath = this.pathList[startIndex];
			if(this.currentSelectedPath == undefined){
				this.currentSelectedPath = '';
			}
			this.pathList.splice(startIndex, 2);
		} else {
			this.pathList = this.pathKey.split("/");
			const startIndex = this.pathList.length - 2;
			this.currentSelectedPath = this.pathList[startIndex];
			if(this.currentSelectedPath == undefined){
				this.currentSelectedPath = '';
			}
			this.pathList.splice(startIndex, 2);
		}
	}
	public pathKey: any = '';
	getBredCrumbData(index) {
		this.pathKey = '';
		for (let i = 0; i <= index + 1; i++) {
			const key = this.pathList[i];
			this.pathKey = this.pathKey.concat(key + '/');
		}
		this.showNewFolderAndUploadDropdown = false;
		this.vdrprentfolder = {};
		if(this.pathKey != ''){
			this.docApiService.getFoderByKey(this.pathKey);
		}
		this.getPathList();
		const serachByKey = {
			key: this.pathKey,
			log: this.storageService.getUserLog()
		}
        this.docApiService.GetFolderByKey(serachByKey);
	}
	showMessage(message: any) {
		console.log(message);
		this.DocIndex = message.item[1];
		//   this.deleteDoc();
	}
	viewDetails(details: any) {
		this.docDetailActivity = true;
		this.setClickedRow(details.item[1], true, details.item[0])
	}
	renameFromMenu(details: any) {
		this.setClickedRow(details.item[1], true, details.item[0])
		if (!details.item[0].folder) {
			if (this.selectedRowFile) {
				if (this.docFilePerms.update) {
					this.openRenameModal();
				} else {
					this.notificationService.notify("warning", "You don't have permission");
				}
			} else {
				if (this.docFolderPerms.update) {
					this.openRenameModal();
				} else {
					this.notificationService.notify("warning", "You don't have permission");
				}
			}
		}
	}
	moveFromMenu(details: any) {
		this.setClickedRow(details.item[1], true, details.item[0]);
		if (this.selectedRowFile) {
			if (this.docFilePerms.update) {
                this.docApiService.GetMoveFolderData(this.storageService.getUserLog());
				this.moveModalOpen();
			} else {
				this.notificationService.notify("warning", "You don't have permission");
			}
		} else {
			if (this.docFolderPerms.update) {
				this.moveModalOpen();
			} else {
				this.notificationService.notify("warning", "You don't have permission");
			}
		}

	}
	deleteFromMenu(details: any) {
		this.setClickedRow(details.item[1], true, details.item[0])
		if (this.selectedRowFile) {
			if (this.docFilePerms.update) {
				this.deleteDocAlert();
			} else {
				this.notificationService.notify("warning", "You don't have permission");
			}
		} else {
			if (this.docFolderPerms.update) {
				this.deleteDocAlert();
			} else {
				this.notificationService.notify("warning", "You don't have permission");
			}
		}

	}
	downloadFromMenu(details: any) {
		this.setClickedRow(details.item[1], true, details.item[0])
		this.selectedRowFile = true;
		// if (this.docFilePerms.download) {
		// 	this.download();
		// } else {
		// 	this.notificationService.notify("warning", "You don't have permission");
		// }
		this.download();
	}
	changeGridView() {
		if (this.documentViewList) {
			this.documentViewList = false;
		} else {
			this.documentViewList = true;
		}
	}
	showDeatailsGrid() {
		this.docDetailActivity = !this.docDetailActivity;
		if (this.vdrprentfolder && this.vdrprentfolder.key)
            this.docApiService.GetDocAudit(this.vdrprentfolder);
	}
	hideDeatailsGrid() {
        this.docDetailActivity = false;
        this.docApiService.ResetAudit();
	}
	chatList() {
		//$('#chatLists').modal("show");
	}
	closeChatList() {
		//$('#chatLists').modal("hide");
	}

	shareDocument() {
		//$('#shareDoc').modal("show");
	}
	shareDocumentClose() {
		//$('#shareDoc').modal("hide");
	}

	showQuickAccess() {
		if (this.searchText.length > 2) {
			this.QuickAccess = true;
		}
		else {
			this.QuickAccess = false;
		}

	}
	closeDocView(activeModal) {
		//$(activeModal).modal("hide");
		this.renameText = '';
		// this.files = [];
	}

	/******************************************** Rename function start ******************************/
	public renameInput: boolean = true;
	public renameFileExt: any = '';
	public renameText: any = '';
	openRenameModal() {
		if (this.vdrprentfolder.folder) {
			this.renameText = this.vdrprentfolder.rollName;
			this.renameFileExt = '';
		} else {
			const renameFileText = this.vdrprentfolder.rollName.split('.').slice(0, -1).join('.');
			this.renameFileExt = '.' + this.vdrprentfolder.fileExt;
			this.renameText = renameFileText;
		}
		const object = {
			renameInput:true,
			renameFileExt:this.renameFileExt,
			renameText:this.renameText
		}
		this.modelService.open('createNewfolder',object);
	}
	public renameKeyList: any;
	public renameKey: any = '';
	public renameTargate: any = '';
	renameFileAndFolder() {
		this.renameKey = '';
		this.renameKeyList = [];
		this.renameTargate = '';
		if (this.vdrprentfolder.folder) {
			this.renameKeyList = this.vdrprentfolder.key.split("/");
			const startIndex = this.renameKeyList.length - 2;
			this.renameKeyList.splice(startIndex, 2);
			this.renameKeyList.forEach(element => {
				this.renameKey = this.renameKey.concat(element + '/');
			});
		} else {
			this.renameKeyList = this.vdrprentfolder.key.split("/");
			const startIndex = this.renameKeyList.length - 1;
			this.renameKeyList.splice(startIndex, 1);
			this.renameKeyList.forEach(element => {
				this.renameKey = this.renameKey.concat(element + '/');
			});
		}
		if (this.renameKey != '' && this.renameText != '') {
			if (this.vdrprentfolder.folder) {
				this.renameTargate = this.renameKey + this.renameText + '/';
			} else {
				this.renameTargate = this.renameKey + this.renameText + this.renameFileExt;
			}
			var renameSearchModule = {
				action: 'rename',
				projectMod: 'e',
				data: {
					source: this.vdrprentfolder.key,
					log: this.storageService.getUserLog(),
					target: this.renameTargate
				}
			}
            this.docApiService.DocDelete(renameSearchModule);
		} else {
			if (this.vdrprentfolder.folder) {
				this.notificationService.notify("bg-danger", "Please Enter New Name of folder.");
			} else {
				this.notificationService.notify("bg-danger", "Please Enter New Name of file.");
			}
		}


	}
	/******************************************** Rename function End ******************************/
	/******************************************** New Folder function Start ******************************/
	createNewFolder() {
		const object = {
			renameInput : false,
			renameText : '',
			renameFileExt : ''
		}
		this.modelService.open('createNewfolder',object);
		if (!this.vdrprentfolder.folder) {
			this.vdrprentfolder = this.openFolderData;
		}
	}	
	createNewFolders() {
		this.useDetails();
        this.docApiService.CreateFolder(this.newFolder);
		setTimeout(() => {
			this.getPathList();
            this.qucikAccess = false;
            this.docApiService.GetFolderChild(this.vdrprentfolder);
		}, 3000);
	}
	/******************************************** Rename function End ******************************/

	fileUploadModal() {
		const object = {
			parentFolder : this.vdrprentfolder
		}
		this.modelService.open('docFileUpload',object)
	}
	/**
	 * on file drop handler
	 */
	onFileDropped($event, fileDrop: boolean, selectedFolder: any) {
		this.fileDrop = fileDrop;
		if (selectedFolder) {
			this.vdrprentfolder = selectedFolder;
		}
		this.prepareFilesList($event);
	}
	/**
	 * handle file from browsing
	 */
	fileBrowseHandler(files) {
		this.fileDrop = false;
		this.prepareFilesList(files);
	}

	/**
	 * Delete file from files list
	 * @param index (File index)
	 */
	deleteFile(index: number) {
		this.files.splice(index, 1);
	}

	/**
	 * Simulate the upload process
	 */

	uploadFilesSimulator(index: number) {
		this.uploadFile = true;
		this.uploadFiles();
	}

	/**
	 * Convert Files list to normal array list
	 * @param files (Files List)
	 */
	public xtr: any;
	public obj: any = {};
	public uploadData: any = []
	public uploadFilesData: any = [];
	prepareFilesList(files: Array<any>) {
		for (const item of files) {
			item.progress = 0;
			this.files.push(item);
		}
		for (var i = 0; i < files.length; i++) {
			var file = files[i];
			this.uploadFilesData.push(file);
			var reader = new FileReader();
			reader.onload = this.readNoticeFile
			reader.readAsDataURL(file);
		}

	}


	readNoticeFile = (e) => {
		var rxFile = this.uploadFilesData[0];
		this.uploadFilesData.splice(0, 1);
		this.uploadData.push({
			fileData: e.target.result.split(',')[1],
			fileName: rxFile.name,
			fileExtn: rxFile.name.split('.')[1],
			size: rxFile.size,
			innerBucketPath: this.vdrprentfolder.key + "/" + rxFile.name
		});
		if (this.fileDrop) {
			this.uploadFilesSimulator(0);
		}
	}

	/**
	 * format bytes
	 * @param bytes (File size in bytes)
	 * @param decimals (Decimals point)
	 */
	formatBytes(bytes, decimals) {
		if (bytes === 0) {
			return '0 Bytes';
		}
		const k = 1024;
		const dm = decimals <= 0 ? 0 : decimals || 2;
		const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
	}

	public vdrprentfolder: any = [];
	public hideRightClickMove: boolean = true;
	setClickedRow = function (index, file, Details, temp?) {
		this.hidehome = true;
		//this.store.dispatch(new VdrActions.SetCaseParentFolder(false))
		if (Details.refCodeRoot != null) {
			this.showNewFolderAndUploadDropdown = true;
			this.selectedRow = index;
            this.vdrprentfolder = Details;
            this.docApiService.GetDocAudit(this.vdrprentfolder);

		} else {
			this.selectionAny = true;
			this.selectedRow = index;
			this.showNewFolderAndUploadDropdown = true;
			this.fileSelectRow = -1;
			this.selectedRowFile = false;
            this.vdrprentfolder = Details;
            this.docApiService.GetDocAudit(this.vdrprentfolder);
			if (file) {
				this.selectedRowFile = true;
				this.showNewFolderAndUploadDropdown = true;
				this.selectedRow = -1;
				this.fileSelectRow = index;
			}
		}

		if (temp == 'FromsearchData') {
			this.hideRightClickMove = false;

		}
		else {
			this.hideRightClickMove = true
		}
		this.getPathList();
	}

	openFolder(selectedFolder: any, param: any) {
		this.qucikAccess = false;
		this.vdrprentfolder = selectedFolder;
		this.openFolderData = selectedFolder;
		this.getPathList();
		this.childFolders = [];
		this.childFiles = [];
		this.selectedRow = -1;
		this.fileSelectRow = -1;
		this.selectionAny = false;
        this.selectedRowFile = false;
        this.docApiService.GetFolderChild(selectedFolder);
		if (param == 'FromsearchData') {
			//this.store.dispatch(new docActions.ResetSearch());
			this.SearchDocument = [];
			this.searchDocumentFolders = [];
			this.searchDocumentFiles = [];
			this.searchText = '';
			this.showQuickAccess()
		}
	}

	getFileExtentionForFolderExplore(ext): any {
		const availableExtension = ['doc', 'docm', 'docx', 'dotx', 'jpeg', 'jpg', 'pdf', 'png', 'ppt', 'pptx', 'rtf', 'tiff', 'txt', 'xl', 'xls', 'xlsm', 'xlsx'];

		if (ext && availableExtension.indexOf(ext) > -1) {
			return 'assets/img/fileImages/' + ext + '.png';
		} else {
			return 'assets/img/fileImages/default.png'
		}
	}

	getFileImageForFolders(ext): any {
		const availableExtension = ['doc', 'docm', 'docx', 'dotx', 'jpeg', 'jpg', 'pdf', 'png', 'ppt', 'pptx', 'rtf', 'tiff', 'txt', 'xl', 'xls', 'xlsm', 'xlsx'];
		if (ext && availableExtension.indexOf(ext) > -1) {
			return 'assets/img/filefolderImage/' + ext + '.png';
		} else {
			return 'assets/img/filefolderImage/default.png'
		}
	}

	// start move functionality------
	//public moveDocModal: boolean = false;
	public moveFolderChildren: any = [];
	public selectedMoveFolder: any = [];
	public moveParentFolder: any = [];
	public selectedRows: any = -1;
	public firstTimeOpenMoveModel: boolean;
	moveModalOpen() {
		this.firstTimeOpenMoveModel = true;
		const object = {
			"documentViewList": this.documentViewList
		}
		this.modelService.open('moveDocModel',object);
	}

	moveModalClose() {
		this.firstTimeOpenMoveModel = true;
		this.selectedRows = -1;
		this.modelService.close('moveDocModel');
	}

	openMoveModalFolder(selectedFolder: any) {
		this.firstTimeOpenMoveModel = false;
		this.selectedRows = -1;
        this.selectedMoveFolder = selectedFolder;
        this.docApiService.GetMoveFolderChild(selectedFolder);
	}

	setClickedMoveModalRow(index, Details) {
		this.selectedRows = index;
		this.selectedMoveFolder = Details;

	}
	public backKeyList: any = [];
	public backKey: any = '';
	public backWithKey: any;
	back() {
		this.firstTimeOpenMoveModel = false;
		this.backKey = '';
		this.backKeyList = [];
		if (this.selectedRows != -1) {
			this.selectedRows = -1;
			this.backKeyList = this.selectedMoveFolder.key.split("/");
			const startIndex = this.backKeyList.length - 3;
			this.backKeyList.splice(startIndex, 3);
			this.backKeyList.forEach(element => {
				this.backKey = this.backKey.concat(element + '/');
			});
		} else {
			if (this.selectedMoveFolder.key != null) {
				this.backKeyList = this.selectedMoveFolder.key.split("/");
				const startIndex = this.backKeyList.length - 2;
				this.backKeyList.splice(startIndex, 2);
				this.backKeyList.forEach(element => {
					this.backKey = this.backKey.concat(element + '/');
				});
			} else if (this.openFolderData.key != null) {
				this.backKeyList = this.openFolderData.key.split("/");
				const startIndex = this.backKeyList.length - 2;
				this.backKeyList.splice(startIndex, 2);
				this.backKeyList.forEach(element => {
					this.backKey = this.backKey.concat(element + '/');
				});
			}
			else {
				this.backKeyList = this.backWithKey.split("/");
				const startIndex = this.backKeyList.length - 2;
				this.backKeyList.splice(startIndex, 2);
				this.backKeyList.forEach(element => {
					this.backKey = this.backKey.concat(element + '/');
				});
			}

		}
		this.selectedMoveFolder.key = null;
		this.openFolderData.key = null;
		this.moveFolderChildren = [];
		this.backWithKey = this.backKey;
		if (this.backKeyList.length == 1) {
			this.rootDataCall("back");
		} else {
			const serachByKey = {
				key: this.backKey,
				log: this.storageService.getUserLog()
			}
			this.docApiService.GetBackFoldersByKey(serachByKey);
		}




	}

	moveDocument() {
		this.movefolderName = this.vdrprentfolder.rollName;
		var moveSearchModule = {
			action: 'move',
			projectMod: 'e',
			data: {
				source: this.vdrprentfolder.key,                // select folder key
				log: this.storageService.getUserLog(),
				target: this.selectedMoveFolder.key
			}
		}
		this.docApiService.DocDelete(moveSearchModule);

	}

	// End move functionality------------------------------------------------






	//    deleteDoc(){
	// 	   if(this.DocIndex || this.DocIndex==0){
	// 			  this.store.dispatch(new trashActions.trashDocument(this.DocIndex));
	// 			  this.DocIndex=false;
	// 	   }
	// 	   else{
	// 			this.store.dispatch(new trashActions.trashDocument(this.fileSelectRow));
	// 	   }
	//    }
	public deleteAlert: boolean = false;
	deleteDocAlert() {
		// $('#conformation-modal').modal("show");
		this.deleteAlert = true;
	}

	deleteDocument() {
		this.selecteDelteFileName = this.vdrprentfolder.rollName;
		var delSEarchModule = {
			action: 'del',
			projectMod: 'e',
			data: {
				source: this.vdrprentfolder.key,
				log: this.storageService.getUserLog()
			}
		}
		this.docApiService.DocDelete(delSEarchModule)
		this.closeDeleteDocAlert();
		// this.store.dispatch(new VdrActions.GetFolderChld(this.selectFolder));
	}

	closeDeleteDocAlert() {
		this.deleteAlert = false;
	}


	recentData(mes: any) {
		// if (mes) {
		// 	this.store.dispatch(new recentActions.RecentData(mes.item[1]));
		// 	mes = false;
		// }
		// else {
		// 	this.store.dispatch(new recentActions.RecentData(this.fileSelectRow));
		// }
	}

	//    deleteDoc(){
	// 	this.store.dispatch(new trashActions.trashDocument(this.fileSelectRow));
	//    }
	useDetails() {
		this.newFolder = {
			parentId: this.vdrprentfolder._id,
			parentFolder: this.vdrprentfolder.rollName,
			parenteTag: this.vdrprentfolder.eTag,
			isFolder: true,
			key: this.vdrprentfolder.key + this.folderName,
			rollName: this.folderName,
			log: this.storageService.getUserLog(),
			createdBy: this.storageService.getUserLog().userId,
			uploadData: this.uploadData,
			bucket:this.vdrprentfolder.bucket,
			refCode:this.storageService.getRefCode(),
			appId:this.storageService.getAppId()
			//caseId: this.storageService.GetCurrentCaseId(),
		}
	}


	uploadFiles() {
		this.useDetails();
		var newObj = Object.assign({}, this.newFolder);

		var sessionid = Object.assign({}, this.storageService.getUserLog())
		newObj.log.sessionId = sessionid.sessionId + ";" + this.storageService.GetIdToken();
		newObj.rollName = newObj.parentFolder;
		newObj.isFolder = false;
		this.docApiService.SaveUploadFile(newObj);
		this.uploadFilesData = [];
		setTimeout(() => {
			this.getPathList();
			this.qucikAccess = false;
			this.docApiService.GetFolderChild(this.vdrprentfolder);
		}, 5000);

	}

	public dataDownload: any;
	public downloadClick: any = '';
	download() {
		this.dataDownload = this.vdrprentfolder;
		this.downloadClick = this.vdrprentfolder.rollName;
		this.dataDownload.log = this.storageService.getUserLog();
		this.docApiService.DocFileDownload(this.dataDownload);
	}
	rightViewFile(files) {
		this.viewFile(files.item[0]);
	}
	public viewFileName: any;
	public viewFileType: any = '';
	public viewLinkOfFile: any = '';
	viewFile(files) {
		this.vdrprentfolder = files;
		this.viewFileName = files.rollName;
		files.log = this.storageService.getUserLog();
		const exten = files.fileExt;
		if (exten == 'pdf' || exten == 'PDF') {
			this.viewFileType = '';
			const object = {
				"fileType":this.viewFileType,
				"viewFileName" : this.viewFileName
			}
			this.modelService.open('docViewModal',object);
			//$('#docViewModal').modal('show');
			//this.viewFileType = 'pdf';
			// this.store.dispatch(
			//  	new VdrActions.GetViewLink(files)
			//  )
		} else if (exten == 'png' || exten == 'jpg') {
			this.viewFileType = 'image';
			this.docApiService.GetDocFileViewLink(files);
		} else {
			this.viewFileType = '';
			const object = {
				"fileType":this.viewFileType,
				"viewFileName" : this.viewFileName
			}
			this.modelService.open('docViewModal',object);
			//$('#docViewModal').modal('show');
		}
		// this.store.dispatch(
		// 	new VdrActions.GetDownloadLink(files)
		// )
	}


	toShare() {
		var list = [];
		if (this.selectedPermissionList && this.selectedPermissionList.length > 0) {
			this.selectedPermissionList.forEach(element => {
				var peoples = {
					user_id: element.user_id,
					userId: element.userId,
					email: element.email,
					creator: this.accessCtrlObj.creator,
					viewer: this.accessCtrlObj.viewer,
					downloader: this.accessCtrlObj.downloader,
					authoriser: this.accessCtrlObj.authoriser
				}
				list.push(peoples);
			})
		}
		var toShareModule = {
			refCode: this.storageService.getUserLog().refCode,
			//case_id: this.storageService.GetCurrentCaseId(),
			sharedby_id: this.storageService.GetUserInfo()._id,
			sharedbyUserId: this.storageService.GetUserInfo().userId,
			sharedByEmail: this.storageService.GetUserInfo().email,
			doc: this.vdrprentfolder,
			users: [...list],
			// permission:{...this.accessCtrlObj}
		}
		var shareList = [];
		shareList.push(toShareModule);
		this.docApiService.toShare(shareList);
		this.shareDocumentClose();
	}

	public accessCtrlObj: any = {};
	public isDisabledView: boolean;
	public isDisabledDwnld: boolean;
	public isDisabledFull: boolean;
	AccessControl(val, bool) {
		if (val == 'view') {
			this.isDisabledDwnld = bool;
			this.isDisabledFull = bool;
			this.accessCtrlObj = {
				creator: false,
				viewer: true,
				downloader: false,
				authoriser: false,
			}
		}
		else if (val == 'download') {
			this.isDisabledView = bool;
			this.isDisabledFull = bool;
			this.accessCtrlObj = {
				creator: false,
				viewer: true,
				downloader: true,
				authoriser: false
			}
		}
		else {
			this.isDisabledView = bool;
			this.isDisabledDwnld = bool;
			this.accessCtrlObj = {
				creator: true,
				viewer: true,
				downloader: true,
				authoriser: true
			}
		}
	}
	folderUploadModel(){
		const object = {
			
		}
		this.modelService.open('docFolderUpload',object);
	}
	// All child Component Responce //
	createFolderResponce(responce){
		if(responce.newfolderText){
			this.folderName = responce.newfolderText
			this.createNewFolders();
		}
		if(responce.renameText){
			this.renameText = responce.renameText
			this.renameFileExt = responce.renameFileExt
			this.renameFileAndFolder();
		}
		console.log(responce);
	}
	uploadDocFileResponce(responce){
		if(responce.uploadData){
			this.uploadData = responce.uploadData;
			this.uploadFilesSimulator(0);
		}
	}
	moveFileFolderResponce(responce){
		switch (responce.action) {
			case "back":
				this.back();
				break;
			case "close":
				this.moveModalClose();
				break;	
			case "double_Click":
				this.openMoveModalFolder(responce.object);
				break;
			case "click":
				this.setClickedMoveModalRow(responce.index,responce.object);
				break;	
			case "move":
				this.moveDocument();	
				break;
			default:
				break;
		}
	}
	docViewModalResponce(responce){
		switch (responce.action) {
			case "download":
				this.download();
				break;
		
			default:
				break;
		}
	}
	uploadDocFolderResponce(responce){
		console.log(responce);
	}

}



