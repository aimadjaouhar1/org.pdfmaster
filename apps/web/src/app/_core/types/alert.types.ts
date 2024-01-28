export type Alert = {isVisible: boolean, message: string | string[] | undefined, type: AlertType};

export type AlertType = 'alert' | 'success' | 'info' | 'warning' | 'danger';
