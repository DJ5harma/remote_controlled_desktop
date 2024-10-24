export type IFormType = "Register" | "Login";
export interface IFormData {
	username: string;
	email: string;
	password: string;
	confirmPassword: string;
}
export interface IViewer {
	_id: string;
	username: string;
	canModify: boolean;
	canSpeak: boolean;
}
export interface IUser {
	_id: string;
	username: string;
	email: string;
	friends: IViewer[];
	viewers: IViewer[];
	sessionPassword: string;
}
