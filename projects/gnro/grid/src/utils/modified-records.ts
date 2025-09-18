import { GnroDataType } from '@gnro/ui/core';
import { GnroCellEdit } from '../models/grid.model';

export function getModifiedRecords<T>(records: GnroDataType[], value: GnroCellEdit<T>): GnroDataType[] {
  const find = records.find((record) => record[value.recordKey] === value.recordId);
  const modifiedRecords = [...records].filter((record) => record[value.recordKey] !== value.recordId);
  if (find) {
    if (value.changed) {
      (find as { [key: string]: T })[value.field] = value.value;
    } else {
      delete (find as { [key: string]: T })[value.field];
    }
    if (Object.keys(find).length > 1) {
      modifiedRecords.push(find);
    }
  } else {
    const record = {
      [value.recordKey]: value.recordId,
      [value.field]: value.value,
    };
    modifiedRecords.push(record as GnroDataType);
  }
  return modifiedRecords;
}
