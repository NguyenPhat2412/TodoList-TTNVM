import React, { createContext, useContext } from 'react';

type CategoryContextType = {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
};

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

export const CategoryProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedCategory, setSelectedCategory] = React.useState('All');
  return (
    <CategoryContext.Provider value={{ selectedCategory, setSelectedCategory }}>
      {children}
    </CategoryContext.Provider>
  );
};

export const useCategory = () => {
  const context = useContext(CategoryContext);
  if (!context) {
    throw new Error('useCategory must be used within a CategoryProvider');
  }
  return context;
};
