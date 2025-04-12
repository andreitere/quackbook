import {createSharedComposable} from "@vueuse/core";

export const useQuackDuck = createSharedComposable(() => {
  const quack = new Audio("/assets/duck_quack.mp3");
  const playQuack = async () => {
    await quack.play()
  }

  return {playQuack}
})