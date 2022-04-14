<template>
  <div class="home bg-darkBlue min-h-screen flex justify-center items-center">
    <div
      class="register-box p-7 flex flex-col justify-between items-center w-full min-h-[470px] bg-lightBlue mx-3 sm:w-[580px] rounded shadow-black shadow-2xl"
    >
      <div class="titles">
        <h1 class="text-white font-bold text-2xl mb-4">Assalomu alaykum!</h1>
        <p class="text-white ">
          Ismingiz orqali ro'yxatdan o'tib, o'zingizga kerakli testni
          tanlashingiz mumkin.
        </p>
      </div>
      <div class="inputs mb-8 w-full">
        <input
          type="text"
          placeholder="Ism"
          class="w-full border bg-ultraLightBlue my-4 pl-5 py-2 pr-10 outline-none rounded text-white placeholder:text-gray-300"
        />
        <Listbox as="div" v-model="selected">
          <div class="mt-1 relative">
            <ListboxButton
              class="relative border cursor-pointer w-full bg-ultraLightBlue rounded pl-3 pr-10 py-2 text-left focus:outline-none focus:ring-1 sm:text-sm"
            >
              <span class="flex items-center">
                <span class="ml-3 block text-white truncate">{{
                  selected
                }}</span>
              </span>
            </ListboxButton>

            <transition
              leave-active-class="transition ease-in duration-100"
              leave-from-class="opacity-100"
              leave-to-class="opacity-0"
              enter-active-class="transition ease-in duration-100"
            >
              <ListboxOptions
                class="absolute z-10 mt-1 w-full bg-ultraLightBlue shadow-lg max-h-56 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm"
              >
                <ListboxOption
                  as="template"
                  v-for="category in categories"
                  :key="category"
                  :value="category"
                  v-slot="{ active, selected }"
                  class="cursor-pointer"
                >
                  <li
                    :class="[
                      active ? 'text-white bg-darkBlue' : 'text-gray-900',
                      'cursor-default select-none relative py-2 pl-3 pr-9',
                    ]"
                  >
                    <div class="flex items-center">
                      <span
                        :class="[
                          selected ? 'font-bold' : 'font-normal',
                          'ml-3 block truncate text-white',
                        ]"
                      >
                        {{ category }}
                      </span>
                    </div>
                  </li>
                </ListboxOption>
              </ListboxOptions>
            </transition>
          </div>
        </Listbox>
      </div>
      <div class="button w-full">
        <button
          class="btn bg-darkBlue rounded transition-all hover:-translate-y-1 hover:shadow-lg text-white uppercase font-bold w-full p-4"
        >
          boshlash
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, watch } from "vue";
import {
  Listbox,
  ListboxButton,
  ListboxLabel,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/vue";
const categories = [
  "Tarix",
  "Ingliz tili",
  "Informatika",
  "Category",
  "Random1",
  "Random2",
  "Random3",
  "Random4",
  "Random5",
];
export default {
  name: "HomeView",
  components: {
    Listbox,
    ListboxButton,
    ListboxLabel,
    ListboxOption,
    ListboxOptions,
  },
  setup() {
    const selected = ref(categories[1]);

    return {
      categories,
      selected,
    };
  },
};
</script>
