export interface InputType {
  type: 'email' | 'select' | 'checkbox' | 'text' | 'password';
  label: string;
  name: string;
  component?: any;
  extraProps?: object;
  multiline?: boolean;
  disabled?: boolean;
  value?: string;
}
