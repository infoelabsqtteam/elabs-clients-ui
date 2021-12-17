import { Injectable } from '@angular/core';

@Injectable()
export class ModalService {

  private modals: any[] = [];
 
    add(modal: any) {
        this.modals.push(modal);
    }
 
    remove(id: string) {
        this.modals = this.modals.filter(x => x.id !== id);
    }
 
    open(id: string,object) {
        let modal: any = this.modals.filter(x => x.id === id)[0];
        modal.showModal(object);
    }
    openTreeView(id: string,object) {
        let modal: any = this.modals.filter(x => x.id === id)[0];
        modal.showTreeViewModal(object);
    }
    openGridViewSelection(id: string,object) {
        let modal: any = this.modals.filter(x => x.id === id)[0];
        modal.showGridViwSelectionModal(object);
    }
    openGridSelection(id: string,object) {
        let modal: any = this.modals.filter(x => x.id === id)[0];
        modal.showGridViewSelectionModal(object);
    }
    openFormModal(id: string,object){
        let modal: any = this.modals.filter(x => x.id === id)[0];
        modal.showFormModal(object);
    }
    openAddOrder(id: string,object){
        let modal: any = this.modals.filter(x => x.id === id)[0];
        modal.showAddOrderModal(object);
    }
    openLandingFunctionsModal(id: string,object){
        let modal: any = this.modals.filter(x => x.id === id)[0];
        modal.showLandingFunctionModal(object);
    }
    openFranchiseModal(id: string,object){
        let modal: any = this.modals.filter(x => x.id === id)[0];
        modal.showFranchiseModal(object);
    }
    close(id: string) {
        let modal: any = this.modals.filter(x => x.id === id)[0];
        modal.close();
    }

}