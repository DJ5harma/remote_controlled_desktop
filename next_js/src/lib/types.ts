export type IFormType = "Register" | "Login";
export interface IFormData {
	username: string;
	email: string;
	password: string;
	confirmPassword: string;
}

export type NUser =
	| {
			_id: string;
			username: string;
			email: string;
	  }
	| undefined;

export type IUser =
	| (NUser & {
			friends: NUser[];
	  })
	| undefined;
