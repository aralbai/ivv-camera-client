"use client";

import { createContext, useState, useContext } from "react";

const MenuContext = createContext();

export default function MenuContextProvider({ children }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <MenuContext.Provider
      value={{
        menuOpen,
        setMenuOpen,
      }}
    >
      {children}
    </MenuContext.Provider>
  );
}

export const useMenuContext = () => useContext(MenuContext);
