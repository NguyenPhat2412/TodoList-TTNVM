export interface Todo {
  _id: string;
  title?: string;
  completed?: boolean;
  description?: string;
  index?: number;
  category?: string;
  startDate?: Date | null;
  dueDate?: Date | null;
  userId?: string;
  prioritize?: string;
  progress?: string;
}

export interface Data {
  _id: string;
  id: number;
  title: string;
  completed: boolean;
}
export type RootStackParamList = {
  About: undefined;
  Home: undefined;
  Profile: undefined;
  Contact: undefined;
  Privacy: undefined;
  Login: undefined;
  Register: undefined;
  UpdateTodo: { todo: Todo };
  AddTodo: undefined;
  OnboardingScreen: undefined;
};
