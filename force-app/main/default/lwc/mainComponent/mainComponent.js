import { LightningElement, api, track } from 'lwc';
import searchAccountsByParentId from '@salesforce/apex/AccountController.searchAccountsByParentId';
import { FlowNavigationNextEvent, FlowAttributeChangeEvent } from 'lightning/flowSupport';

const COLUMNS = [
    { label: 'Id', fieldName: 'Id' },
    { label: 'Nombre', fieldName: 'Name' },
    { label: 'Motivo', fieldName: 'Motivo'},
    { label: 'Observación', fieldName: 'Observacion' },
    { label: '' }
];

export default class MainComponent extends LightningElement {
    columns = COLUMNS;
    @track records = [];
    @track searchTerm = '';
    @track accounts = [];
    @track allAccounts = [];
    @track selectedAccount = {};
    @track isSelectedAccount=false;
    @track isButtonDisabled = true;
    @track _txtOUTVal = '';
    
    @api accountId;
    @api
    get txtOUTVal() {
        return this._txtOUTVal;
    }
    get isSendButtonDisabled(){
        return this.records.length > 0 ? false : true; 
    }
    get getStyle(){
        return `display:${!this.accounts.length ? 'none' : 'block'}`
    }
    set txtOUTVal(val) {
        this._txtOUTVal = val;
    }

    connectedCallback() {
        this.getAllAccounts(this.accountId);
    }
    getAllAccounts(parentAccountId) {
        searchAccountsByParentId({ parentId: parentAccountId })
            .then(result => {
                this.allAccounts = result;
                this.accounts = this.allAccounts;
            })
            .catch(error => {
                console.error('Error en la búsqueda:', error);
            });
    }
    handleSearchTermChange(event) {
        this.searchTerm = event.target.value;
        this.accounts = this.allAccounts.filter(account =>{
            if(account.Name.includes(this.searchTerm)){
                return account
            }
        });
    }
    handleAddRecord() {
        const hasRecord = this.records.some(rec=>rec.Id===this.selectedAccount.Id);
        if(hasRecord)return;
        this.records.push({ ...this.selectedAccount,Motivo: '', Observacion: '',editRow : false});
        this.selectedAccount = null;
        this.isSelectedAccount = false;
        this.isButtonDisabled = true;
    }
    handleDeleteRow(event){
        const index = event.detail;
        if (index !== undefined && index >= 0 && index < this.records.length) {
            const newRecords = [...this.records];
            newRecords.splice(index, 1);
            this.records = newRecords;
        }
    }
    handleInputChange(event){
        const index = event.detail.index;
        const field = event.detail.field;
        const value = event.detail.value;
        this.records[index][field] = value;
    }
    saveInput(){
        this.records = this.records.map(rec => {
            return { ...rec, editRow: false };
        });
    }
    
    selectAccount(event){
        const accountId = event.currentTarget.dataset.accountId;
        this.selectedAccount = this.allAccounts.find(acc => {
            if (acc.Id === accountId) {
                this.isSelectedAccount = true;
                this.isButtonDisabled = false;
                return acc
            }
        });
    }
    deleteAccount(){
        this.selectedAccount = null;
        this.isSelectedAccount = false;
        this.isButtonDisabled = true;
    }
    submitRecords(){
        console.log(JSON.stringify(this.records));
    }
}