import { useRouter } from "next/router";
import { Dispatch, SetStateAction, useEffect } from "react";
import { ConsumptionActive } from "~/types/admin";

type ConsumptionState = {
  drinks: boolean;
  foods: boolean;
  games: boolean;
  promos: boolean;
};

type KeyMap = {
  [key: string]: string;
};

export const useUserIdHotkeys = (
  setConsumptionActive: Dispatch<SetStateAction<ConsumptionActive>>,
  categories: { name: string; id: string }[] | undefined
) => {
  const router = useRouter();

  const keyMap: KeyMap = {
    "1": "Bebida",
    "2": "Comida",
    "3": "Juego",
    "4": "Promociones",
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();

      if (e.key === "Enter") {
        router.push("/");
      }

      if (e.key === "4") {
        setConsumptionActive("Promociones");
      }

      const category = keyMap[e.key];
      if (category) {
        const selectedCategory = categories?.find((c) => c.name === category);
        if (selectedCategory) {
          setConsumptionActive(selectedCategory.name as ConsumptionActive);
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [router, setConsumptionActive, categories, keyMap]);
};
