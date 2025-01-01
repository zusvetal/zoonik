export enum SettingsControlsNames {
  isActive = 'isActive',
  id  = 'id',
  name = 'name',
  description = 'description',
  originalName = 'originalName',
  url = 'url',
}

export interface VideoRecord {
  id?: number;
  name: string;
  isActive: boolean;
  description?: string;
  originalName?: string;
  url: string;
}
