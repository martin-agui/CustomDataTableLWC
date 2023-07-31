import { LightningElement, api, track } from 'lwc';

export default class CustomDataTable extends LightningElement {
    @api columns;
    @api records;

    handleEditClick(event) {
        const id = event.currentTarget.dataset.id;
        this.editingRowIndex = this.records.findIndex(rec => rec.Id === id);
        this.records = this.records.map((rec, index) => {
            return { ...rec, editRow: index === this.editingRowIndex };
        });
    }
    handleSaveClick(event) {
        this.editingRowIndex = -1;
        const saveEvent = new CustomEvent('saveinput');
        this.dispatchEvent(saveEvent);
    }
    handleDelete(event) {
        const index = event.currentTarget.dataset.index;
        const deleteRowEvent = new CustomEvent('delete', { detail: index });
        this.dispatchEvent(deleteRowEvent);
    }

    handleInputChange(event) {
        const changeEvent = new CustomEvent('changeinput', {
             detail: {
                index : event.currentTarget.dataset.index,
                field : event.currentTarget.dataset.field,
                value : event.target.value
             } 
        });
        this.dispatchEvent(changeEvent);
      }
}